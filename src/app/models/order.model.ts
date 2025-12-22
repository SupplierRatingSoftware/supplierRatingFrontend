/**
 * Order Data-Model for Mocking
 */
export type RatingStatus = 'RATED' | 'PENDING';

/**
 * OrderBaseDTO interface
 */
export interface OrderBase {
  // Optional fields, not marked as "required"
  name?: string;
  mainCategory?: string;
  subCategory?: string;
  details?: string;
  rhythm?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  reason?: string;
  orderMethod?: string;
  orderedBy?: string;
  orderDate?: string; // format: YYYY-MM-DD
  deliveryDate?: string;
  comment?: string;
}

/**
 * OrderDTO interface
 */
export interface Order extends OrderBase {
  id: string; // OpenBIS PermID (Stable Identifier)
  code: string; // OpenBIS Code (Business Identifier)
  ratingStatus?: RatingStatus; // Unser eigener Typ von oben
}
