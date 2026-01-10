import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, X } from 'lucide-angular';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SUPPLIER_FORM_CONFIG } from '../../models/supplier.config';
import { SupplierSummaryDTO } from '../../openapi-gen';

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
   * Lucide Icons
   */
  protected readonly UserIcon = User;
  protected readonly X = X;

  /**
   * Input: Receives current supplier from parent
   */
  readonly supplier = signal<SupplierSummaryDTO | null>(null);

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
  getSupplierValue(s: SupplierSummaryDTO, key: string): string | number | undefined | null {
    // Secured access via type-cast on Supplier index type
    const value = s[key as keyof SupplierSummaryDTO];

    // Since RatingStats and Orders are complex objects, we return only primitive values here.
    if (typeof value === 'string') {
      return value;
    }

    return null;
  }
}
