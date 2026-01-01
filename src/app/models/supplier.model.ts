/**
 * Supplier Data-Model for Mocking
 */

import { Order } from './order.model';

/**
 * SupplierDTO interface
 */
export interface Supplier extends SupplierBase {
  id: string; // OpenBIS PermID (Stable Identifier)
  code: string; // OpenBIS Code (Business Identifier)

  // Optional fields, not marked as "required"
  orders?: Order[];
  stats?: RatingStats;
}

/**
 * SupplierBaseDTO interface
 */
export interface SupplierBase {
  name: string;
  zipCode: string;
  city: string;
  country: string;
  customerNumber: string;
  street: string;
  website: string;
  vatId: string;
  conditions: string;

  // Optional fields, not marked as "required"
  addition?: string;
  poBox?: string;
  email?: string;
  phoneNumber?: string;
  customerInfo?: string;
}

/**
 * RatingStats interface
 * @description RatingStats declares the statistics of a supplier
 */
export interface RatingStats {
  // Optional fields, not marked as "required"
  avgQuality?: number;
  avgCost?: number;
  avgDeadline?: number;
  avgAvailability?: number;
  avgTotal?: number;
  totalRatingCount?: number; // Important for the trust-worthiness: "Based on X ratings"
}

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
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'number' | 'select';
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
