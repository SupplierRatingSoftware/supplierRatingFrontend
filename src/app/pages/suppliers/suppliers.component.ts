import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { User } from 'lucide-angular';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn, ListItem],
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

  // State: Initial List of suppliers
  readonly suppliers = signal<Supplier[]>([]);

  ngOnInit(): void {
    this.loadSuppliers();
  }

  /**
   * Loads supplier-data from the service and updates the signal state
   */
  loadSuppliers() {
    this.supplierService
      .getSuppliers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.suppliers.set(data);
          // TODO: Optional LOGGING
          // console.log('Suppliers loaded:', data);
        },
        error: err => console.error('Error loading suppliers:', err),
      });
  }

  addSupplier() {
    /**
     * TODO: Add openModal functionality and save supplier-data here
     */
    // console.log('Add/Save Supplier clicked');
    // Logic to add a new item to the signal array
    // this.suppliers.update();
  }
}
