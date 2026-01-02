import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { LucideAngularModule, User } from 'lucide-angular';
import { NgbModal, NgbModalOptions, NgbOffcanvas, NgbOffcanvasOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from '../../components/toast/toast.component';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { ListItem } from '../../components/list-item/list-item';
import { ModalFormSupplierComponent } from '../../components/modal-form-supplier/modal-form-supplier';
import { PanelFormSupplierComponent } from '../../components/panel-form-supplier/panel-form-supplier';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn, ToastComponent, LucideAngularModule, ListItem],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersComponent implements OnInit {
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
   * Injected SupplierService
   * @private
   */
  private supplierService: SupplierService = inject(SupplierService);
  private destroyRef = inject(DestroyRef);

  /**
   * State: List of all suppliers
   */
  readonly suppliers = signal<Supplier[]>([]);

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
    this.loadSuppliers();
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
          this.errorMessage.set(
            'Laden der Lieferanten fehlgeschlagen. Bitte überprüfe deine Verbindung und versuche erneut.'
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
   * Select Supplier and show Offcanvas with data-details
   */
  selectSupplier(supplier: Supplier) {
    const offcanvasRef = this.offCanvasService.open(PanelFormSupplierComponent, this.offCanvasOptions);

    // Send data into Offcanvas Component
    offcanvasRef.componentInstance.supplier.set(supplier);
  }

  /**
   * Opens Modal for adding or editing a supplier
   */
  openSupplierModal() {
    this.handleSupplierModal();
  }

  /**
   * Opens the modal in edit mode for an existing supplier
   * @param supplier The supplier to edit
   */
  openEditSupplierModal(supplier: Supplier) {
    this.handleSupplierModal(supplier);
  }

  /**
   * Internal helper to manage the supplier modal lifecycle for both create and update actions.
   * @param supplier Optional supplier for edit mode
   * @private
   */
  private handleSupplierModal(supplier?: Supplier) {
    const modalRef = this.modalService.open(ModalFormSupplierComponent, this.modalOptions);

    if (supplier) {
      modalRef.componentInstance.supplier.set(supplier);
    }

    modalRef.result.then(
      (result: Supplier) => {
        if (!result) return;

        if (supplier?.id) {
          this.updateExistingSupplier(supplier.id, result);
        } else {
          this.createAndAddSupplier(result);
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
   * Creates a new supplier and adds it to the list view
   * @param formData
   * @private
   */
  private createAndAddSupplier(formData: Supplier) {
    this.supplierService
      .addSupplier(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: addedSupplier => {
          this.suppliers.update(current => [...current, addedSupplier]);
          this.selectSupplier(addedSupplier);
        },
        error: () => this.errorMessage.set(`Fehler beim Speichern: ${formData.name}`),
      });
  }

  /**
   * Updates an existing supplier and refreshes the local state
   * @param id The stable identifier
   * @param formData The updated data from the form
   * @private
   */
  private updateExistingSupplier(id: string, formData: Supplier) {
    const existing = this.suppliers().find(s => s.id === id);
    const updatedPayload = { ...existing, ...formData, id };

    this.supplierService
      .updateSupplier(id, updatedPayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: updated => {
          this.suppliers.update(list => list.map(s => (s.id === id ? updated : s)));
          this.selectSupplier(updated);
        },
        error: () => this.errorMessage.set('Fehler beim Aktualisieren.'),
      });
  }

  /**
   * Filters the list of suppliers based on the current search term
   * @description Computed Signal: Automatically recalculates the list, if the search term OR the list changes.
   */
  readonly filteredSuppliers = computed(() => {
    const list = this.suppliers();
    const term = this.searchTerm().toLowerCase();

    // If no search term is provided, return the full list
    if (!term) {
      return list;
    }

    // Else filter the list based on the search term
    return list.filter(
      supplier =>
        // Search by name
        supplier.name.toLowerCase().includes(term) ||
        // Or search by code
        supplier.zipCode.toLowerCase().includes(term) ||
        // Or search by city
        supplier.city.toLowerCase().includes(term) ||
        // Or search by customerNumber
        supplier.customerNumber.toLowerCase().includes(term) ||
        // Or search by street
        supplier.street.toLowerCase().includes(term) ||
        // Or search by website
        supplier.website.toLowerCase().includes(term) ||
        // Or search by vatId
        supplier.vatId.toLowerCase().includes(term) ||
        // Or search by poBox
        supplier.poBox?.toLowerCase().includes(term) ||
        // Or search by email
        supplier.email?.toLowerCase().includes(term) ||
        // Or search by phoneNumber
        supplier.phoneNumber?.toLowerCase().includes(term)
    );
  });
}
