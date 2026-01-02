import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, X } from 'lucide-angular';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from '../../models/supplier.model';
import { SUPPLIER_FORM_CONFIG } from '../../models/supplier.config';

@Component({
  selector: 'app-panel-form-supplier',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './panel-form-supplier.html',
  styleUrl: './panel-form-supplier.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelFormSupplierComponent {
  /**
   * Lucide Icon
   */
  protected readonly UserIcon = User;

  /**
   * Input: Receives current supplier from parent
   */
  readonly supplier = signal<Supplier | null>(null);

  /**
   * Reference to the active Offcanvas, to control the offcanvas lifecycle
   */
  readonly activeOffcanvas = inject(NgbActiveOffcanvas);

  /**
   * Central configuration for displaying sections
   * @protected
   */
  protected readonly config = SUPPLIER_FORM_CONFIG;

  /**
   * Type secured help method for accessing supplier data without 'any'.
   * We safely cast the string key to a Supplier interface key.
   * @param s The Supplier object
   * @param key The technical key from the configuration
   */
  getSupplierValue(s: Supplier, key: string): string | number | undefined | null {
    // Secured access via type-cast on Supplier index type
    const value = s[key as keyof Supplier];

    // Since RatingStats and Orders are complex objects, we return only primitive values here.
    if (typeof value === 'string') {
      return value;
    }

    return null;
  }

  protected readonly X = X;
}
