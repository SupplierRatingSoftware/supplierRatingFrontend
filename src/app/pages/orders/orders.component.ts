import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { NotepadText } from 'lucide-angular';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-orders',
  imports: [ListSearch, AddBtn, ListItem, ToastComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly NotepadText = NotepadText;

  /**
   * Injected OrderService
   * @private
   */
  private orderService: OrderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);

  /**
   * State: Initial list of orders
   */
  readonly orders = signal<Order[]>([]);

  /**
   * State: Error message for UI to display
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit() {
    this.loadOrders();
  }

  /**
   * Loads order-data from the service and updates the signal state
   * If an error occurs, an error message should be displayed.
   * @private
   */
  private loadOrders() {
    this.errorMessage.set(null);

    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.orders.set(data);
        },
        error: () => {
          this.errorMessage.set('Unable to load orders. Please check your connection and try again.');
        },
      });
  }

  /**
   * TODO: Add openModal functionality and save order-data here
   */
  addOrder() {
    // this.orders.update();
  }

  /**
   * Closes the Toast error message
   * @protected
   */
  protected closeToast() {
    this.errorMessage.set(null);
  }
}
