import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { User } from 'lucide-angular';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn, ListItem],
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

  // State: List of suppliers
  readonly suppliers = signal<string[]>(['Lieferant A', 'Lieferant B']);

  addSupplier() {
    // Logic to add a new item to the signal array
    this.suppliers.update(current => [...current, `Lieferant ${current.length + 1}`]);
  }
}
