import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { LucideAngularModule, User } from 'lucide-angular';
import {
  NgbModal,
  NgbModalOptions,
  NgbOffcanvas,
  NgbOffcanvasOptions,
  NgbOffcanvasRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from '../../components/toast/toast.component';
import { ListItem } from '../../components/list-item/list-item';
import { ModalEditOrderComponent } from '../../components/modal-edit-order/modal-edit-order';
import { PanelFormOrderComponent } from '../../components/panel-form-order/panel-form-order';
import { DefaultService, OrderCreateDTO, OrderSummaryDTO, OrderUpdateDTO, RatingCreateDTO } from '../../openapi-gen';
import { ModalRatingComponent } from '../../components/modal-rating/modal-rating';
import { ModalAddOrderComponent } from '../../components/modal-add-order/modal-add-order';

// HIER: Das Interface einfach lokal definieren.
interface OrderModalResult {
  action: 'SAVE' | 'RATE';
  // Das Formular kann Daten für ein Update oder ein Create liefern
  data: OrderCreateDTO | OrderUpdateDTO;
}

@Component({
  selector: 'app-orders',
  imports: [ListSearch, AddBtn, ListItem, ToastComponent, LucideAngularModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly UserIcon = User;

  // NEU: Hier speichern wir den Zugriff auf das Panel
  private activePanelRef?: NgbOffcanvasRef;

  /**
   * Injected NgbModal as our modal service
   * @private
   */
  private modalService = inject(NgbModal);

  /**
   * Modal Options
   * @private
   */
  private readonly modalOptions: NgbModalOptions = {
    animation: true,
    size: 'lg',
    fullscreen: 'md',
    centered: true,
    backdrop: 'static',
    scrollable: true,
  };

  /**
   * Injected NgbOffcanvas as our offcanvas service
   * @private
   */
  private offCanvasService = inject(NgbOffcanvas);

  /**
   * Offcanvas Options
   * @private
   */
  private readonly offCanvasOptions: NgbOffcanvasOptions = {
    animation: true,
    panelClass: 'w-sm-100 w-md-50',
    position: 'end',
    backdrop: true,
    scroll: true,
  };

  /**
   * Injected OrderService, ratingService and DestroyRef
   * @private
   */
  private orderService: DefaultService = inject(DefaultService);
  private ratingService = inject(DefaultService);
  private destroyRef = inject(DestroyRef);

  /**
   * State: List of all orders
   */
  readonly orders = signal<OrderSummaryDTO[]>([]);

  /**
   * State: The actual search term for filtering list-items
   */
  readonly searchTerm = signal<string>('');

  /**
   * State: Error message for UI to display
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit() {
    this.loadOrders();
  }

  /**
   * Loads order-data from the service and updates the signal state
   * If an error occurs, an error message should be displayed.
   */
  private loadOrders() {
    this.errorMessage.set(null);
    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.orders.set(data);
        },
        error: () => {
          this.errorMessage.set(
            'Laden der Bestellungen fehlgeschlagen. Bitte überprüfe deine Verbindung und versuche erneut.'
          );
        },
      });
  }

  /**
   * Closes the Toast error message
   * @protected
   */
  protected closeToast() {
    this.errorMessage.set(null);
  }

  /**
   * Wird aufgerufen, wenn man auf ein Item klickt (nicht auf den Edit-Button).
   * 1. Öffnet das Offcanvas.
   * 2. Lädt Details (inkl. supplierName, ratingId).
   * 3. Lädt Rating (falls vorhanden).
   */
  openDetailPanel(summaryOrder: OrderSummaryDTO) {
    this.errorMessage.set(null);

    // 1. Offcanvas öffnen und Referenz speichern
    this.activePanelRef = this.offCanvasService.open(PanelFormOrderComponent, this.offCanvasOptions);

    // Ab hier nutzen wir this.activePanelRef statt der lokalen const offcanvasRef
    const panelInstance = this.activePanelRef.componentInstance as PanelFormOrderComponent;

    // Setze vorläufige Daten (Name fehlt hier evtl. wenn aus Liste geladen)
    panelInstance.order.set(summaryOrder);

    // Optional: Titel oder Loading State setzen, falls gewünscht.
    // Das Panel zeigt "Keine Daten geladen" an, bis wir das Signal setzen.

    // 2. Volle Order-Daten laden (GET /orders/{id})
    this.orderService
      .getOrderById(summaryOrder.id)
      .pipe(takeUntilDestroyed(this.destroyRef)) // Wichtig: Stoppt Request wenn Component zerstört wird
      .subscribe({
        next: detailedOrder => {
          // Daten an das Panel übergeben (Signal setzen)
          panelInstance.order.set(detailedOrder);

          // 3. Prüfen, ob eine Rating ID existiert, und falls ja: Rating laden
          if (detailedOrder.ratingId) {
            this.loadRatingForPanel(detailedOrder.ratingId, panelInstance);
          }
        },
        error: () => {
          this.errorMessage.set('Fehler beim Laden der Details.');
        },
      });
  }

  /**
   * Hilfsmethode um das Rating zu laden und ins Panel zu schieben
   */
  private loadRatingForPanel(ratingId: string, panelInstance: PanelFormOrderComponent) {
    this.ratingService
      .getRatingById(ratingId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ratingData => {
          // Rating an das Panel übergeben
          panelInstance.rating.set(ratingData);
        },
        error: () => {
          // Wenn Rating laden fehlschlägt, ist das nicht kritisch, wir zeigen einfach keins an.
          console.error('Rating konnte nicht geladen werden');
        },
      });
  }

  /**
   * Opens Modal for adding or editing an order
   */
  openAddOrderModal() {
    const modalRef = this.modalService.open(ModalAddOrderComponent, this.modalOptions);
    modalRef.result.then(
      (result: OrderModalResult) => {
        // Wir wissen, bei "Neu" ist es ein CreateDTO
        // Wir nutzen 'as unknown' um Typ-Konflikte mit strikten DTOs zu vermeiden
        const createData = result.data as unknown as OrderCreateDTO;

        if (result.action === 'SAVE') {
          this.createAndAddOrder(createData);
        } else if (result.action === 'RATE') {
          this.openRatingModal(createData);
        }
      },
      () => {
        /* dismissed */
      }
    );
  }

  /** this.createAndAddOrder(createData);
   * Opens the modal in edit mode for an existing order
   * @param summaryOrder The order to edit
   * Öffnet das Modal im Bearbeitungs-Modus.
   * WICHTIG: Wir laden zuerst die vollen Details, damit 'supplierId' vorhanden ist.
   *
   */
  openEditOrderModal(summaryOrder: OrderSummaryDTO) {
    const modalRef = this.modalService.open(ModalEditOrderComponent, this.modalOptions);

    // Das summaryOrder an das Modal übergeben
    modalRef.componentInstance.order.set(summaryOrder);

    // 5. Ergebnis verarbeiten (wie bisher)
    modalRef.result.then(
      (result: OrderModalResult) => {
        const updateData = result.data;

        if (result.action === 'SAVE') {
          this.updateExistingOrder(summaryOrder.id, updateData);
        } else if (result.action === 'RATE') {
          const combinedData = { ...updateData, id: summaryOrder.id };
          this.openRatingModal(combinedData);
        }
      },
      () => {
        /* Modal abgebrochen */
      }
    );
  }

  /**
   * 3. Das Rating Modal (Verkettung)
   * Wird aufgerufen, wenn User "Speichern & Bewerten" klickte.
   */
  private openRatingModal(orderData: Partial<OrderSummaryDTO>) {
    const modalRef = this.modalService.open(ModalRatingComponent, this.modalOptions);

    // Wir übergeben die Order-Daten an das Rating-Modal
    modalRef.componentInstance.order.set(orderData);

    modalRef.result.then(
      (ratingResult: RatingCreateDTO) => {
        if (!ratingResult) return;

        // Fallunterscheidung: Hat das Objekt schon eine ID?
        if (orderData.id) {
          // A) Existierende Bestellung -> Update + Rating
          // (Hier vereinfacht: Wir speichern das Rating direkt, Update müsste separat erfolgen
          // oder wir gehen davon aus, dass Update vorher passierte.
          // Um sicher zu gehen, erstellen wir das Rating:)
          this.createRatingForOrder(orderData.id, ratingResult);

          // Optional: Wenn wir auch Formulardaten updaten müssten,
          // müssten wir hier updateExistingOrder aufrufen.
        } else {
          // B) Neue Bestellung -> Create + Rating kombiniert
          const createData = orderData as OrderCreateDTO;

          // Wir hängen das Rating temporär an, damit createAndAddOrder es verarbeiten kann
          // Wir casten zu einem Intersection Type
          const combinedPayload = {
            ...createData,
            orderRating: ratingResult,
          };

          this.createAndAddOrder(combinedPayload);
        }
      },
      () => {
        /* dismissed */
      }
    );
  }

  /**
   * Erstellt das Rating
   */
  private createRatingForOrder(orderId: string, ratingData: RatingCreateDTO) {
    // Wir setzen die orderId explizit, falls sie im Formular fehlte
    const payload: RatingCreateDTO = { ...ratingData, orderId };

    // Achtung: Wenn DefaultService kein 'createRating' hat, prüfen ob es einen RatingService gibt.
    // Falls DefaultService alle Methoden generiert hat, ist das hier korrekt:
    this.orderService
      .createRating(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Liste neu laden, damit der Status "RATED" sichtbar wird
          this.loadOrders();
        },
        error: () => this.errorMessage.set('Bestellung gespeichert, aber Bewertung fehlgeschlagen.'),
      });
  }

  /**
   * Creates a new order and adds it to the list view
   * @param formData
   * @private
   */
  private createAndAddOrder(formData: OrderCreateDTO & { orderRating?: RatingCreateDTO }) {
    // Destructuring: Wir trennen das Rating vom reinen Order-DTO
    // 'apiPayload' enthält jetzt nur noch Felder, die OrderCreateDTO kennt
    const { orderRating, ...apiPayload } = formData;

    // Cast ist sicher, da wir orderRating entfernt haben
    this.orderService
      .createOrder(apiPayload as OrderCreateDTO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: newOrder => {
          // newOrder ist OrderDetailDTO oder SummaryDTO

          // Wenn wir auch ein Rating haben, speichern wir das jetzt mit der neuen ID
          if (orderRating) {
            this.createRatingForOrder(newOrder.id, orderRating);
          } /*else {
            // Kein Rating -> Fertig. Liste aktualisieren.
            // Wir müssen newOrder in die Liste der SummaryDTOs pushen.
            // Da SummaryDTO meist weniger Felder hat als DetailDTO, ist der Cast ok.
            this.orders.update(current => [...current, newOrder as unknown as OrderSummaryDTO]);
          }*/
        },
        error: () => this.errorMessage.set('Fehler beim Erstellen der Bestellung.'),
      });
  }

  /**
   * Updates an existing order and refreshes the local state
   * @param id The stable identifier
   * @param formData The updated data from the form
   * @private
   */
  private updateExistingOrder(id: string, formData: OrderUpdateDTO) {
    this.orderService
      .updateOrder(id, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: updatedOrder => {
          // Liste lokal aktualisieren
          this.orders.update(list => list.map(o => (o.id === id ? (updatedOrder as unknown as OrderSummaryDTO) : o)));
        },
        error: () => this.errorMessage.set('Fehler beim Aktualisieren.'),
      });
  }

  /**
   * Filters the list of orders based on the current search term
   * @description Computed Signal: Automatically recalculates the list, if the search term OR the list changes.
   */
  readonly filteredOrders = computed(() => {
    const list = this.orders();
    const term = this.searchTerm().toLowerCase();

    // If no search term is provided, return the full list
    if (!term) {
      return list;
    }

    //Todo: Extend filtering criteria as needed
    // Else filter the list based on the search term
    return list.filter(
      order =>
        // Search by name
        (order.name || '').toLowerCase().includes(term) ||
        // Or search by orderedBy
        (order.orderedBy || '').toLowerCase().includes(term)
    );
  });
}
