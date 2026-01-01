import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { LucideAngularModule, User } from 'lucide-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from '../../components/toast/toast.component';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { ListItem } from '../../components/list-item/list-item';
import { ModalFormSupplierComponent } from '../../components/modal-form-supplier/modal-form-supplier';

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
   * Injected SupplierService
   * @private
   */
  private supplierService: SupplierService = inject(SupplierService);
  private destroyRef = inject(DestroyRef);

  /**
   * State: Initial list of suppliers
   */
  readonly suppliers = signal<Supplier[]>([]);

  /**
   * State: Currently selected supplier for detail view
   */
  readonly selectedSupplier = signal<Supplier | null>(null);

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
   * Select current Supplier
   */
  selectSupplier(supplier: Supplier) {
    this.selectedSupplier.set(supplier);
  }

  /**
   * Opens Modal for adding or editing a supplier
   */
  openSupplierModal() {
    const modalRef = this.modalService.open(ModalFormSupplierComponent, {
      animation: true,
      size: 'lg',
      fullscreen: 'md',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    /**
     * This method waits for the result of the edit-modal and handles the supplier data accordingly.
     */
    modalRef.result.then(
      (result: Supplier) => {
        if (result) {
          // When saved, call the update logic
          this.createAndAddSupplier(result);
        }
      },
      () => {
        // Modal was closed without saving; no action required.
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
        error: () => this.errorMessage.set('Fehler beim Speichern.'),
      });
  }

  // TODO
  /**
   * 1. Diese Funktion öffnet das Modal im Bearbeitungs-Modus (wird im suppliers.component.html aufgerufen)
   */
  // openEditSupplierModal(supplier: Supplier) {
  //   const modalRef = this.modalService.open(ModalFormSupplierComponent, {
  //     size: 'lg',
  //     centered: true,
  //     backdrop: 'static',
  //   });
  //   // WICHTIG: Hier füllen wir das "Postfach" (Signal) des Modals
  //   // mit dem Lieferanten, den wir gerade bearbeiten wollen.
  //   modalRef.componentInstance.supplier.set(supplier);
  //
  //   // Wir warten darauf, dass der User im Modal auf "Speichern" klickt
  //   modalRef.result.then(
  //     (result: Supplier) => {
  //       if (result && supplier.id) {
  //         // Wenn Daten zurückkommen, rufen wir die Update-Funktion auf
  //         this.updateExistingSupplier(supplier.id, result);
  //       }
  //     },
  //     reason => {
  //       // Handle modal dismissal or errors
  //       if (reason !== 0 && reason !== 1) {
  //         console.error('Modal error:', reason);
  //       }
  //     }
  //   );
  // }

  //TODO
  /**
   * 2. Diese Funktion speichert die Änderungen
   */
  // private updateExistingSupplier(id: string, formData: Supplier) {
  //   // 1. Wir holen uns den aktuellen Stand des Lieferanten (inkl. seiner Orders!)
  //   const existingSupplier = this.suppliers().find(s => s.id === id);
  //
  //   // 2. Wir "mergen" die Daten:
  //   // Alles vom alten Objekt behalten, aber die Felder aus dem Formular überschreiben.
  //   const updatedSupplier = {
  //     ...existingSupplier,
  //     ...formData,
  //     id, // Sicherstellen, dass die ID bleibt
  //   };

  //   this.supplierService
  //     .updateSupplier(id, updatedSupplier) // Diese Methode muss in deinem Service existieren
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: res => {
  //         // REAKTIVITÄT: In der Liste ersetzen
  //         this.suppliers.update(current => current.map(s => (s.id === id ? res : s)));
  //
  //         // WICHTIG: Wenn der Service die Orders nicht mitsendet,
  //         // müssen wir sie hier eventuell manuell wieder an 'res' hängen
  //         if (!res.orders && existingSupplier?.orders) {
  //           res.orders = existingSupplier.orders;
  //         }
  //
  //         // Detailansicht aktualisieren -> Computed Signal berechnet Stats neu
  //         this.selectSupplier(res);
  //       },
  //       error: () => this.errorMessage.set('Fehler beim Aktualisieren.'),
  //     });
  // }

  //TODO
  // /**
  //  * Setzt die Auswahl zurück und schließt somit die rechte Spalte
  //  */
  // protected closeDetail() {
  //   this.selectedSupplier.set(null);
  // }
}
