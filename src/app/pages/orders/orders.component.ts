import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { LucideAngularModule, User } from 'lucide-angular';
import { NgbModal, NgbModalOptions, NgbOffcanvas, NgbOffcanvasOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from '../../components/toast/toast.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { ListItem } from '../../components/list-item/list-item';
import { ModalFormOrderComponent } from '../../components/modal-form-order/modal-form-order';
import { RatingService } from '../../services/rating.service';
import { PanelFormOrderComponent } from '../../components/panel-form-order/panel-form-order';

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
  private orderService: OrderService = inject(OrderService);
  private ratingService = inject(RatingService);
  private destroyRef = inject(DestroyRef);

  /**
   * State: List of all orders
   */
  readonly orders = signal<Order[]>([]);

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
  openDetailPanel(summaryOrder: Order) {
    this.errorMessage.set(null);

    // 1. Offcanvas öffnen (UI erscheint sofort, aber leer)
    const offcanvasRef = this.offCanvasService.open(PanelFormOrderComponent, this.offCanvasOptions);

    // Wir können direkt auf die Instanz zugreifen:
    const panelInstance = offcanvasRef.componentInstance as PanelFormOrderComponent;

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
          // Optional: Offcanvas wieder schließen bei Fehler
          offcanvasRef.dismiss();
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
  openOrderModal() {
    this.handleOrderModal();
  }

  /**
   * Opens the modal in edit mode for an existing order
   * @param order The order to edit
   */
  openEditOrderModal(order: Order) {
    this.handleOrderModal(order);
  }

  /**
   * Internal helper to manage the order modal lifecycle for both create and update actions.
   * @param order Optional order for edit mode
   * @private
   */
  private handleOrderModal(order?: Order) {
    const modalRef = this.modalService.open(ModalFormOrderComponent, this.modalOptions);

    if (order) {
      modalRef.componentInstance.order.set(order);
    }

    modalRef.result.then(
      (result: Order) => {
        if (!result) return;

        if (order?.id) {
          this.updateExistingOrder(order.id, result);
        } else {
          this.createAndAddOrder(result);
        }
      },
      reason => {
        if (reason !== 0 && reason !== 1 && reason !== undefined) {
          console.log(reason);
          this.errorMessage.set(`Fehler beim Bearbeiten des Eintrages: ${reason}`);
        }
      }
    );
  }

  /**
   * Creates a new order and adds it to the list view
   * @param formData
   * @private
   */
  private createAndAddOrder(formData: Order) {
    this.orderService
      .addOrder(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: addedOrder => {
          this.orders.update(current => [...current, addedOrder]);
        },
        error: () => this.errorMessage.set(`Fehler beim Speichern: ${formData.name}`),
      });
  }

  /**
   * Updates an existing order and refreshes the local state
   * @param id The stable identifier
   * @param formData The updated data from the form
   * @private
   */
  private updateExistingOrder(id: string, formData: Order) {
    const existing = this.orders().find(s => s.id === id);
    const updatedPayload = { ...existing, ...formData, id };

    this.orderService
      .updateOrder(id, updatedPayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: updated => {
          this.orders.update(list => list.map(o => (o.id === id ? updated : o)));
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
        order.name.toLowerCase().includes(term) ||
        // Or search by orderedBy
        order.orderedBy.toLowerCase().includes(term)
    );
  });
}
