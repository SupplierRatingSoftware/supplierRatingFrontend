import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotepadText, ShoppingCart } from 'lucide-angular';
import { ModalFormOrderComponent, OrderFormData } from '../../components/modal-form-order/modal-form-order';
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
  protected readonly OrderIcon = ShoppingCart;
  private modalService = inject(NgbModal);

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

  openOrderModal() {
    const modalRef = this.modalService.open(ModalFormOrderComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Hier warten wir darauf, was der User im Modal macht
    modalRef.result.then(
      (result: OrderFormData) => {
        // Wenn der User auf "Speichern" klickt und Daten zurückkommen
        if (result && result.shortName) {
          this.addOrderFromModal(result.shortName);
        }
      },
      () => {
        // Modal wurde bewusst ohne Speichern geschlossen; keine Aktion erforderlich.
      }
    );
  }

  // Hilfsfunktion, um den neuen Namen in deine Signal-Liste zu schreiben
  private addOrderFromModal(name: string) {
    this.orders.update(current => [...current, name]);
  }
}
