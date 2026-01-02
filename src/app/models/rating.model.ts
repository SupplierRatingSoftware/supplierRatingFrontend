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
  deadline?: number;
  deadlineReason?: string;
  availability?: number;
  availabilityReason?: string;
  totalScore?: number;
  comment?: string;
}
