import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
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
      // uncomment for simulated error for displaying the toast
      // throwError(() => new Error('Simulated Error'))
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
