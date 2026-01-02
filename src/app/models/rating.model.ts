/**
 * Rating Data-Model for Mocking
 */

/**
 * RatingDTO interface
 */
export interface Rating extends RatingBase {
  id: string;
  code: string;
  orderId: string;
  supplierId: string;
  supplierName?: string;
}

/**
 * RatingBaseDTO interface
 */
export interface RatingBase {
  quality: number; // 1-5
  cost: number;
  deadline: number;
  deadlineReason?: string;
  availability: number;

  // Optional fields, not marked as "required"
  qualityReason?: string;
  costReason?: string;
  availabilityReason?: string;
  totalScore?: number;
  comment?: string;
}

/**
 * RatingCreateDTO interface
 * @description DTO for creating a new rating and connect it to an order*
 */
export interface RatingCreate extends RatingBase {
  orderId: string; // Connection to order
}
