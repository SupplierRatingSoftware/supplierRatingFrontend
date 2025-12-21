import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { NotepadText } from 'lucide-angular';

@Component({
  selector: 'app-orders',
  imports: [ListSearch, AddBtn, ListItem],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly NotepadText = NotepadText;

  // State: List of orders
  readonly orders = signal<string[]>(['Bestellung 1', 'Bestellung 2']);

  protected addOrders() {
    console.log('add orders');
    this.orders.update(current => [...current, `Bestellung ${current.length + 1}`]);
  }
}
