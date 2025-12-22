import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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

  // State: Initial List of suppliers
  readonly suppliers = signal<Supplier[]>([]);

  ngOnInit(): void {
    this.loadSuppliers();
  }

  /**
   * Loads supplier-data from the service and updates the signal state
   */
  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: data => {
        this.suppliers.set(data);
        console.log('Suppliers loaded:', data);
      },
      error: err => console.error('Error loading suppliers:', err),
    });
  }

  addSupplier() {
    /**
     * TODO: No Backend at the moment to save supplier-data
     */
    console.log('Add/Save Supplier clicked');
    // Logic to add a new item to the signal array
    // this.suppliers.update();
  }
}
