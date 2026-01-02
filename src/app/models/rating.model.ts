/**
 * Rating Data-Model for Mocking
 */

/**
 * RatingCreateDTO interface
 * @description DTO for creating a new rating and connect it to an order
 */
export interface RatingCreate extends Rating {
  orderId: string; // Connection to order
}

/**
 * RatingDetailDTO interface
 */
export interface Rating extends RatingBase {
  id: string;
  code: string;
  orderId: string;
  supplierId: string;

  // Optional fields, not marked as "required"
  supplierName?: string;
}

/**
 * RatingBaseDTO interface
 */
export interface RatingBase {
  quality: number; // 1-5
  cost: number;
  deadline: number;
  availability: number;

  // Optional fields, not marked as "required"
  qualityReason?: string;
  costReason?: string;
  deadlineReason?: string;
  availabilityReason?: string;
  totalScore?: number;
  comment?: string;
}
