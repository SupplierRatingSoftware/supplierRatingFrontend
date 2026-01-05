/**
 * Order Data-Model for Mocking
 */

/**
 * OrderCreateDTO interface
 */
export interface OrderCreate extends OrderBase {
  supplierId: string;
}

/**
 * OrderDetailDTO interface
 */
export interface Order extends OrderBase {
  id: string;
  code: string;

  // Optional fields, not marked as "required"
  ratingStatus?: RatingStatus;
  supplierId?: string;
  supplierName?: string;
  ratingId?: string | null;
}

/**
 * OrderBaseDTO interface
 */
export interface OrderBase {
  name: string;
  mainCategory: string;
  subCategory: string;
  reason: string;
  orderedBy: string;
  orderDate: string; // format: YYYY-MM-DD

  // Optional fields, not marked as "required"
  details?: string;
  frequency?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  orderMethod?: string;
  deliveryDate?: string;
  orderComment?: string;
}

/**
 * RatingStatus interface
 * @description RatingStatus declares if an order is rated or not
 * @description Possible values: 'RATED' | 'PENDING'
 */
export type RatingStatus = 'RATED' | 'PENDING';

/**
 * Interface for the form configuration
 * @description This interface declares the configuration of a form section
 */
export interface FormSection {
  sectionTitle: string;
  fields: FieldMeta[];
}

/**
 * Interface for the fields metadata of the form
 * @description This interface declares the metadata of a form field in a form section
 */
export interface FieldMeta {
  key: string; // Technical name
  label: string; // Displayed name for the UI
  required: boolean;
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'number' | 'date' | 'select';
  options?: SelectOption[]; // List of selectable options
  gridClass?: string; // CSS-Class for the col-width (e.g. 'col-12', 'col-md-6')
  placeholder?: string;
  validationRules?: ('email' | 'url' | 'phone')[]; // Additional validation rules
}

/**
 * Interface for the select options in the fields metadata
 * @description This interface declares the options of a select field in a form section
 */
export interface SelectOption {
  value: string; // Technical name
  label: string; // Displayed name for the UI
}
