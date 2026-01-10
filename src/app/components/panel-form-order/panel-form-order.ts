import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, X } from 'lucide-angular';
import { NgbActiveOffcanvas, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FieldMeta, Order } from '../../models/order.model';
import { ORDER_FORM_CONFIG } from '../../models/order.config';
import { RATING_FORM_CONFIG } from '../../models/rating.config';
import { RatingDetailDTO } from '../../openapi-gen';

@Component({
  selector: 'app-panel-form-order',
  imports: [CommonModule, LucideAngularModule, NgbRatingModule],
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
   * Input: Receives current order and rating from parent
   */
  readonly order = signal<Order | null>(null);
  readonly rating = signal<RatingDetailDTO | null>(null);

  /**
   * Reference to the active Offcanvas, to control the offcanvas lifecycle
   */
  readonly activeOffcanvas = inject(NgbActiveOffcanvas);

  /**
   * Central configuration for displaying sections
   * @protected
   */
  protected readonly orderConfig = ORDER_FORM_CONFIG;
  protected readonly ratingConfig = RATING_FORM_CONFIG;

  /**
   * Type secured help method for accessing order data without 'any'.
   * We safely cast the string key to an Order interface key.
   * @param o The Order object
   * @param field The field metadata containing the key
   * @returns The value of the specified field in the Order object
   */
  getOrderValue(o: Order, field: FieldMeta): string | number | undefined | null {
    // Special case for supplier name
    // Wir prüfen auf 'supplierId' (falls so in Config) ODER 'supplierName'
    if (field.key === 'supplierId' || field.key === 'supplierName') {
      // 1. Priorität: Der Name
      if (o.supplierName) {
        return o.supplierName;
      }
      // 2. Priorität: Die ID (damit man wenigstens etwas sieht)
      if (o.supplierId) {
        return `ID: ${o.supplierId} (Name wird geladen...)`;
      }
      return '-';
    }

    // Secured access via type-cast on Order index type
    const value = o[field.key as keyof Order];

    // Since RatingStats and Orders are complex objects, we return only primitive values here.
    if (typeof value === 'string') {
      return value;
    }
    return null;
  }

  /**
   * Type secured help method for accessing rating data without 'any'.
   * We safely cast the string key to a Rating interface key.
   * @param r
   * @param key
   */
  getRatingValue(r: RatingDetailDTO, key: string): string | number | undefined | null {
    // Secured access via type-cast on Rating index type
    return r[key as keyof RatingDetailDTO];
  }

  /**
   * Type secured help method for accessing rating numeric data without 'any'.
   * We safely cast the string key to a Rating interface key.
   * @param r
   * @param key
   */
  getRatingNumber(r: RatingDetailDTO, key: string): number {
    const val = r[key as keyof RatingDetailDTO];
    // Wenn es eine Zahl ist, gib sie zurück, sonst 0
    return typeof val === 'number' ? val : 0;
  }
}
