/**
 * Rating Data-Model for Mocking
 */

/**
 * RatingCreateDTO interface
 * @description DTO for creating a new rating and connect it to an order
 */
export interface RatingCreate extends Rating {
  orderId: string; // Connection to order
  quality: number; // 1-5
  qualityReason: string;
  cost: number;
  costReason: string;
  reliability: number;
  reliabilityReason: string;
}

/**
 * RatingDetailDTO interface
 * @description DTO for detailed rating information
 */
export interface Rating extends RatingBase {
  id: string;
  code: string;
  orderId: string;
  totalScore: number; // 1-5

  // Optional fields, not marked as "required"
  supplierId?: string;
  supplierName?: string;
}

/**
 * RatingBaseDTO interface
 */
export interface RatingBase {
  // Optional fields, not marked as "required"
  quality?: number; // 1-5
  qualityReason?: string;
  cost?: number;
  costReason?: string;
  reliability?: number;
  reliabilityReason?: string;
  availability?: number;
  availabilityReason?: string;
  totalScore?: number;
  ratingComment?: string;
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
  requiredIfContact?: boolean;
  type: 'textarea' | 'number' | 'rating' | 'stat-total';
  gridClass?: string; // CSS-Class for the col-width (e.g. 'col-12', 'col-md-6')
  placeholder?: string;
}
