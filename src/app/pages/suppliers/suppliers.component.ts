import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { LucideAngularModule, User } from 'lucide-angular'; //LucideAngularModule importierenklkklll
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap'; // NgbAccordionModule importiert
import { SupplierService } from '../../services/supplier.service';
import { Supplier, SupplierFormData, SupplierMapper } from '../../models/supplier.model';
import { ToastComponent } from '../../components/toast/toast.component';
import { ModalFormSupplierComponent } from '../../components/modal-form-supplier/modal-form-supplier';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn, ListItem, ToastComponent, LucideAngularModule, NgbAccordionModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersComponent implements OnInit {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly User = User;

  /**
   * Injected Modal
   * @private
   */
  private modalService = inject(NgbModal);

  /**
   * Injected SupplierService
   * @private
   */
  private supplierService: SupplierService = inject(SupplierService);
  private destroyRef = inject(DestroyRef);

  /**
   * State: Initial list of suppliers
   */
  readonly suppliers = signal<Supplier[]>([]);

  // Neu: State für den ausgewählten Lieferanten
  readonly selectedSupplier = signal<Supplier | null>(null); // State für Detailansicht

  /**
   * State: Error message for UI to display
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit() {
    this.loadSuppliers();
  }

  /**
   * Neu: Setzt den aktuell ausgewählten Lieferanten
   */
  selectSupplier(supplier: Supplier) {
    this.selectedSupplier.set(supplier);
  }

  /**
   * 1. Diese Funktion öffnet das Modal im Bearbeitungs-Modus (wird im suppliers.component.html aufgerufen)
   */
  openEditSupplierModal(supplier: Supplier) {
    const modalRef = this.modalService.open(ModalFormSupplierComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
    // WICHTIG: Hier füllen wir das "Postfach" (Input) des Modals
    // mit dem Lieferanten, den wir gerade bearbeiten wollen.
    modalRef.componentInstance.supplier = supplier;

    // Wir warten darauf, dass der User im Modal auf "Speichern" klickt
    modalRef.result.then(
      (result: SupplierFormData) => {
        if (result) {
          // Wenn Daten zurückkommen, rufen wir die Update-Funktion auf
          this.updateExistingSupplier(supplier.id, result);
        }
      },
      () => {
        /* User hat abgebrochen (Dismiss) */
      }
    );
  }

  /**
   * 2. Diese Funktion speichert die Änderungen
   */
  private updateExistingSupplier(id: string, formData: SupplierFormData) {
    // NEU: Nur noch eine Zeile statt der langen Liste!
    const updatedSupplier = SupplierMapper.mapFormToSupplier(formData, id);

    this.supplierService
      .updateSupplier(id, updatedSupplier) // Diese Methode muss in deinem Service existieren
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          // REAKTIVITÄT: Wir aktualisieren unsere Liste im Signal.
          // Wir gehen die Liste durch (.map) und tauschen nur den einen
          // Lieferanten mit der passenden ID gegen die neue Version (res) aus.
          this.suppliers.update(current => current.map(s => (s.id === id ? res : s)));

          // Auch die Detailansicht rechts soll sofort den neuen Namen zeigen
          this.selectSupplier(res);
        },
        error: () => this.errorMessage.set('Fehler beim Aktualisieren.'),
      });
  }

  /**
   * This method opens the modal (für den add button, wird im suppliers.component.html aufgerufen)
   */
  openSupplierModal() {
    const modalRef = this.modalService.open(ModalFormSupplierComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Hier warten wir darauf, was der User im Modal macht
    modalRef.result.then(
      (result: SupplierFormData) => {
        if (result) {
          // Wenn gespeichert wurde, rufen wir die Update-Logik auf
          this.createAndAddSupplier(result);
        }
      },
      () => {
        // Modal wurde bewusst ohne Speichern geschlossen; keine Aktion erforderlich.
      }
    );
  }

  private createAndAddSupplier(formData: SupplierFormData) {
    // NEU: Nur noch eine Zeile statt der langen Liste!
    const newSupplierData = SupplierMapper.mapFormToSupplier(formData);

    this.supplierService
      .addSupplier(newSupplierData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: addedSupplier => {
          this.suppliers.update(current => [...current, addedSupplier]);
          this.selectSupplier(addedSupplier);
        },
        error: () => this.errorMessage.set('Fehler beim Speichern.'),
      });
  }

  /**
   * Loads supplier-data from the service and updates the signal state
   * If an error occurs, an error message should be displayed.
   */
  private loadSuppliers() {
    this.errorMessage.set(null);
    this.supplierService
      .getSuppliers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.suppliers.set(data);
        },
        error: () => {
          this.errorMessage.set('Unable to load suppliers. Please check your connection and try again.');
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
   * Setzt die Auswahl zurück und schließt somit die rechte Spalte
   */
  protected closeDetail() {
    this.selectedSupplier.set(null);
  }
}
