/**
 * Order Data-Model for Mocking
 */

/**
 * OrderDTO interface
 */
export interface Order extends OrderBase {
  id: string; // OpenBIS PermID (Stable Identifier)
  code: string; // OpenBIS Code (Business Identifier)

  // Optional fields, not marked as "required"
  ratingStatus?: RatingStatus;
}

/**
 * OrderBaseDTO interface
 */
export interface OrderBase {
  name: string;

  // Optional fields, not marked as "required"
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
 * RatingStatus interface
 * @description RatingStatus declares if an order is rated or not
 * @description Possible values: 'RATED' | 'PENDING'
 */
export type RatingStatus = 'RATED' | 'PENDING';
