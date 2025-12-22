import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { User } from 'lucide-angular';
import { SupplierService } from '../../services/supplier.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn, ListItem, AsyncPipe],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersComponent {
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

  /**
   * Observable of suppliers from the service
   * Using async pipe in template to avoid manual subscription management
   * @protected
   */
  protected readonly suppliers$: Observable<Supplier[]> = this.supplierService.getSuppliers();

  addSupplier() {
    /**
     * TODO: No Backend at the moment to save supplier-data
     */
    console.log('Add/Save Supplier clicked');
  }
}
