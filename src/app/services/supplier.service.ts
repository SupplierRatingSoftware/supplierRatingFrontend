import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Service for providing mocked, async supplier-data.
 */
@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  /**
   * Injected HttpClient
   * @private
   */
  private http = inject(HttpClient);

  /**
   * Base URL for supplier API & headers
   * @private
   */
  private baseUrl = `${environment.apiUrl}/suppliers`;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  /**
   * Mocked supplier data
   * @private
   */
  private readonly mockSuppliers: Supplier[] = [
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
   * GET /suppliers
   */
  getSuppliers(): Observable<Supplier[]> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Using Mock Data for getSuppliers');
      return of(this.mockSuppliers);
    }
    // real backend API call
    return this.http.get<Supplier[]>(this.baseUrl, { headers: this.headers });
  }

  /**
   * POST /suppliers
   */
  addSupplier(supplier: Supplier): Observable<Supplier> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Using Mock Data for createSupplier');
      // we simulate a new object to be returned with an ID
      const newMockSupplier: Supplier = {
        ...supplier,
        id: `mock-id-${Date.now()}`,
        code: `MOCK-${Date.now()}`,
      };
      // push freshly created supplier to mockSuppliers array
      this.mockSuppliers.push(newMockSupplier);

      return of(newMockSupplier);
    }
    // real backend API call
    return this.http.post<Supplier>(this.baseUrl, supplier, { headers: this.headers });
  }
}
