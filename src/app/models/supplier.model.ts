/**
 * Supplier Data-Model for Mocking
 */

/**
 * Interface für die Datenstruktur des Formulars
 */
export interface SupplierFormData {
  fullName: string;
  customerNumber: string;
  street: string;
  poBox: string;
  zipCode: string;
  city: string;
  country: string;
  email: string;
  phoneNumber: string;
  website: string;
  vatNumber: string;
  paymentConditions: string;
  notes: string;
}

/**
 * RatingStats interface
 */
export interface RatingStats {
  avgQuality: number;
  avgCost: number;
  avgDeadline: number;
  avgAvailability: number;
  avgTotal: number;
  totalRatingCount: number;
}

/**
 * SupplierBaseDTO interface
 */
export interface SupplierBase {
  name: string;
  zipCode: string;
  city: string;
  country: string;

  // Optional fields, not marked as "required"
  customerNumber?: string;
  addition?: string;
  street?: string;
  poBox?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  vatId?: string;
  conditions?: string;
  customerInfo?: string;
}

/**
 * SupplierSummaryDTO interface
 */
export interface Supplier extends SupplierBase {
  id: string; // OpenBIS PermID (Stable Identifier)
  code: string; // OpenBIS Code (Business Identifier)

  // Optional fields, not marked as "required"
  stats?: RatingStats;
}

/**
 * Der SupplierMapper ist unser "Übersetzungsbüro".
 * Er weiss genau, wie man Formulardaten in ein Supplier-Objekt umwandelt.
 */
export class SupplierMapper {
  /**
   * Erstellt aus den Formulardaten ein fertiges Supplier-Objekt.
   * Das 'static' erlaubt uns den Aufruf: SupplierMapper.mapFormToSupplier(...)
   * 
   * @param formData - Die Daten aus dem Formular
   * @param id - Die ID des Suppliers (wird vom Backend vergeben beim Erstellen)
   * @param code - Der Code des Suppliers (wird vom Backend vergeben beim Erstellen)
   */
  static mapFormToSupplier(formData: SupplierFormData, id?: string, code?: string): Supplier {
    return {
      id: id || '',
      code: code || '',
      name: formData.fullName,
      customerNumber: formData.customerNumber,
      street: formData.street,
      poBox: formData.poBox,
      zipCode: formData.zipCode,
      city: formData.city,
      country: formData.country,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      website: formData.website,
      vatId: formData.vatNumber, // Hier passiert die Übersetzung
      conditions: formData.paymentConditions,
      customerInfo: formData.notes, // Hier passiert die Übersetzung
    };
  }

  /**
   * NEU: Erstellt aus einem Supplier-Objekt die passenden Daten für das Formular.
   */
  static mapSupplierToForm(supplier: Supplier): SupplierFormData {
    return {
      fullName: supplier.name,

      customerNumber: supplier.customerNumber || '',
      street: supplier.street || '',
      poBox: supplier.poBox || '',
      zipCode: supplier.zipCode || '',
      city: supplier.city || '',
      country: supplier.country || 'Schweiz',
      email: supplier.email || '',
      phoneNumber: supplier.phoneNumber || '',
      website: supplier.website || '',
      vatNumber: supplier.vatId || '', // Mapping zurück
      paymentConditions: supplier.conditions || '',
      notes: supplier.customerInfo || '', // Mapping zurück
    };
  }
}
