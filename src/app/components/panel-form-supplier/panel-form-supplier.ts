import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User } from 'lucide-angular';
import { Supplier } from '../../models/supplier.model';
import { SUPPLIER_FORM_CONFIG } from '../../models/supplier.config';

@Component({
  selector: 'app-panel-form-supplier',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './panel-form-supplier.html',
  styleUrl: './panel-form-supplier.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // OnPush für bessere Performance
})
export class PanelFormSupplierComponent {
  /**
   * Empfängt den aktuell ausgewählten Lieferanten als Signal
   */
  readonly supplier = input<Supplier | null>(null);

  /**
   * Zentrale Konfiguration für die Anzeige-Sektionen
   */
  protected readonly config = SUPPLIER_FORM_CONFIG;

  /**
   * Lucide Icon für den Empty-State
   */
  protected readonly UserIcon = User;

  /**
   * Typsichere Hilfsmethode für den Datenzugriff ohne 'any'.
   * Wir casten den String-Key sicher auf einen Schlüssel des Supplier-Interfaces.
   * @param s Das Supplier-Objekt
   * @param key Der technische Key aus der Konfiguration
   */
  getSupplierValue(s: Supplier, key: string): string | number | undefined | null {
    // Sicherer Zugriff via Type-Cast auf den Index-Typ von Supplier
    const value = s[key as keyof Supplier];

    // Da RatingStats und Orders komplexe Objekte sind, geben wir hier nur primitive Werte zurück.
    // Die Stats werden separat im Template behandelt.
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    return null;
  }
}
