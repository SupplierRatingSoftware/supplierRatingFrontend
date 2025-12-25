/**
 * Supplier Data-Model for Mocking
 */

/**
 * Supplier Data-Model
 */
import { Order } from './order.model';

// Ergänze dieses Interface für die Optionen
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Interface für die Feld-Metadaten (Konfiguration)
 */
export interface FieldMeta {
  key: string; // Technischer Name im Supplier-Objekt
  label: string; // Anzeige-Name im UI
  required: boolean; // Pflichtfeld-Flag
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'number' | 'select';
  options?: SelectOption[]; // Liste der Auswahlmöglichkeiten
  gridClass?: string; // CSS-Klasse für die Spaltenbreite (z.B. 'col-12', 'col-md-6')
  placeholder?: string;
  validationRules?: ('email' | 'url' | 'phone')[]; // Zusätzliche Validierungsregeln
}

/**
 * Interface für eine Sektion im Formular/Panel
 */
export interface FormSection {
  sectionTitle: string;
  fields: FieldMeta[];
}

/**
 * Interface für das Supplier-Ojekt: Verbunden mit Order-Objekt
 */
export interface Supplier {
  id: string; // OpenBIS PermID (Stable Identifier)
  code: string; // OpenBIS Code (Business Identifier)
  orders?: Order[]; // Array von Orders, da ein Lieferant mehrere Bestellungen hat, Optional da evtl. keine Bestellung vorliegt
  stats?: RatingStats; // Optional, da evtl. keine Bewertungen vorliegen, wird via rating.service.ts berechnet
  name: string;
  customerNumber: string;
  addition?: string;
  street: string;
  poBox?: string;
  zipCode: string;
  city: string;
  country: string;
  email?: string;
  phoneNumber?: string;
  website: string;
  vatId: string;
  conditions: string;
  customerInfo?: string;
}

/**
 * Interface für das RatingStats Objekt
 */
export interface RatingStats {
  avgQuality?: number;
  avgCost?: number;
  avgDeadline?: number;
  avgAvailability?: number;
  avgTotal?: number;
  totalRatingCount?: number; // Wichtig für die Glaubwürdigkeit: "Basierend auf X Bewertungen"
}
