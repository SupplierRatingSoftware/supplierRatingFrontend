/**
 * Supplier Data-Model for Mocking
 */

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
