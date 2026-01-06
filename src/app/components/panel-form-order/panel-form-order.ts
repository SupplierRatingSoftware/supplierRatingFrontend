import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, X } from 'lucide-angular';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../../models/order.model';
import { ORDER_FORM_CONFIG } from '../../models/order.config';

@Component({
  selector: 'app-panel-form-order',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './panel-form-order.html',
  styleUrl: './panel-form-order.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelFormOrderComponent {
  /**
   * Lucide Icons
   */
  protected readonly UserIcon = User;
  protected readonly X = X;

  /**
   * Input: Receives current order from parent
   */
  readonly order = signal<Order | null>(null);

  /**
   * Reference to the active Offcanvas, to control the offcanvas lifecycle
   */
  readonly activeOffcanvas = inject(NgbActiveOffcanvas);

  /**
   * Central configuration for displaying sections
   * @protected
   */
  protected readonly config = ORDER_FORM_CONFIG;

  /**
   * Type secured help method for accessing order data without 'any'.
   * We safely cast the string key to a Order interface key.
   * @param o The Order object
   * @param key The technical key from the configuration
   */
  getOrderValue(o: Order, key: string): string | number | undefined | null {
    // Secured access via type-cast on Order index type
    const value = o[key as keyof Order];

    // Since RatingStats and Orders are complex objects, we return only primitive values here.
    if (typeof value === 'string') {
      return value;
    }

    return null;
  }
}
