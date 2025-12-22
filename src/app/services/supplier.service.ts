import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';

/**
 * Service for providing mocked, async supplier-data.
 */
@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  getSuppliers(): Observable<Supplier[]> {
    const mockSuppliers: Supplier[] = [
      {
        id: 'perm-1',
        code: 'SUP-001',
        name: 'Müller Baustoffe GmbH',
        city: 'Berlin',
        country: 'DE',
        zipCode: '10115',
        email: 'kontakt@mueller-bau.de',
        stats: {
          avgQuality: 4.5,
          avgCost: 3.2,
          avgDeadline: 4.8,
          avgAvailability: 5.0,
          avgTotal: 4.4,
          totalRatingCount: 12,
        },
      },
      {
        id: 'perm-2',
        code: 'SUP-002',
        name: 'Swiss Tech AG',
        city: 'Zürich',
        country: 'CH',
        zipCode: '8005',
        stats: {
          avgQuality: 5.0,
          avgCost: 2.5,
          avgDeadline: 5.0,
          avgAvailability: 4.5,
          avgTotal: 4.2,
          totalRatingCount: 5,
        },
      },
    ];

    /**
     * 'of()' takes data and packages it in an Observable.
     * For the component it looks exactly the same as if it came from the real server.
     */
    return of(mockSuppliers);
  }
}
