import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Den Modal-Dienst importieren
import { ModalFormSupplierComponent, SupplierFormData } from '../../components/modal-form-supplier/modal-form-supplier';
import { User } from 'lucide-angular';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn, ListItem, ToastComponent],
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

  /**
   * State: Error message for UI to display
   */
  readonly errorMessage = signal<string | null>(null);
    
  /**
   * This method opens the modal
   */
  openSupplierModal() {
    // modalService.open sagt: "Öffne ein Fenster mit dem Inhalt dieser Komponente"
    const modalRef = this.modalService.open(ModalFormSupplierComponent, {
      size: 'lg', // Größe: Large
      centered: true, // Schön mittig auf dem Bildschirm
      backdrop: 'static', // Verhindert Schliessen beim Klicken in den grauen Bereich
    });

    // Hier warten wir darauf, was der User im Modal macht
    modalRef.result.then(
      (result: SupplierFormData) => {
        // Wenn der User auf "Speichern" klickt und Daten zurückkommen
        if (result && result.fullName) {
          this.addSupplierFromModal(result.fullName);
        }
      },
      () => {
        // Modal wurde bewusst ohne Speichern geschlossen; keine Aktion erforderlich.
      }
    );
  }

  // Hilfsfunktion, um den neuen Namen in deine Signal-Liste zu schreiben
  private addSupplierFromModal(name: string) {
    this.suppliers.update(current => [...current, name]);

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
   * TODO: Add openModal functionality and save supplier-data here
   */
  addSupplier() {
    // this.suppliers.update();
  }

  /**
   * Closes the Toast error message
   * @protected
   */
  protected closeToast() {
    this.errorMessage.set(null);
  }
}
