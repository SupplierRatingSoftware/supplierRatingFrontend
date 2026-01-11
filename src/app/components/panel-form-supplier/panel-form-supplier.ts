import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, X } from 'lucide-angular';
import { NgbActiveOffcanvas, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { SUPPLIER_FORM_CONFIG } from '../../models/supplier.config';
import { RatingStats, SupplierSummaryDTO } from '../../openapi-gen';

@Component({
  selector: 'app-panel-form-supplier',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NgbRatingModule],
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
   * Help method to check if supplier has ratings
   * @param s The Supplier object
   */
  hasRatings(s: SupplierSummaryDTO): boolean {
    return !!s.stats && (s.stats.totalRatingCount || 0) > 0;
  }

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

  /**
   * Type secured help method for accessing supplier stats data without 'any'.
   * We safely cast the string key to a RatingStats interface key.
   * @param s The Supplier object
   * @param key The technical key from the configuration
   */
  getStatNumber(s: SupplierSummaryDTO, key: string): number {
    if (!s.stats) return 0;
    const val = s.stats[key as keyof RatingStats];
    return typeof val === 'number' ? val : 0;
  }

  /**
   * Type secured help method for displaying supplier stats values.
   * If the value is greater than 0, it returns the value formatted to one decimal place.
   * Otherwise, it returns a dash ('-').
   * @param s The Supplier object
   * @param key The technical key from the configuration
   */
  getStatDisplayValue(s: SupplierSummaryDTO, key: string): string {
    const val = this.getStatNumber(s, key);
    return val > 0 ? val.toFixed(1) : '-';
  }
}
