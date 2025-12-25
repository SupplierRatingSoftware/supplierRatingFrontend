import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
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
      customerNumber: 'KD-10001',
      street: 'Musterstrasse 10',
      zipCode: '10115',
      city: 'Berlin',
      country: 'DE',
      email: 'kontakt@mueller-bau.de',
      website: 'https://www.mueller-bau.de',
      vatId: 'DE123456789',
      conditions: '30 Tage netto',
      customerInfo: 'Zuverlässiger Lieferant für Rohbau',
      orders: [], // Leer initialisiert wie gewünscht
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
      customerNumber: 'KD-20002',
      street: 'Gewerbestrasse 5',
      zipCode: '8005',
      city: 'Zürich',
      country: 'CH',
      email: 'info@swisstech.ch',
      website: 'https://www.swisstech.ch',
      vatId: 'CHE-123.456.789 MWST',
      conditions: '10 Tage 2% Skonto',
      customerInfo: 'Spezialist für Präzisionsteile',
      orders: [], // Leer initialisiert wie gewünscht
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
   * @description Retrieves a list of all suppliers
   */
  getSuppliers(): Observable<Supplier[]> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Using Mock Data for getSuppliers');
      // ÄNDERUNG: Nutze den Spread-Operator [...], um eine KOPIE zu senden, weil sonst hatte ich doppelte Einträge in der liste nach + button benutzung
      return of([...this.mockSuppliers]);
    }
    // real backend API call
    return this.http.get<Supplier[]>(this.baseUrl, { headers: this.headers });
  }

  /**
   * POST /suppliers
   * @description Creates a new supplier
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

      return of({ ...newMockSupplier });
    }
    // real backend API call
    return this.http.post<Supplier>(this.baseUrl, supplier, { headers: this.headers });
  }

  /**
   * GET /suppliers/{id}
   * @description Retrieves a supplier by its ID
   */
  getSupplierById(id: string): Observable<Supplier> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Mocking Data for getSupplierById with ID:', id);
      // find the supplier in the mockSuppliers array
      const mockSupplier = this.mockSuppliers.find(s => s.id === id);
      // return the found supplier or the first supplier in the array
      return of(mockSupplier || this.mockSuppliers[0]);
    }
    // real backend API call
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /suppliers/{id}
   * @description Updates an existing supplier
   */
  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      const index = this.mockSuppliers.findIndex(s => s.id === id);
      console.log('⚠️ Mocking Data for updateSupplier with ID:', id);
      if (index !== -1) {
        // Wir überschreiben den alten Eintrag im Array
        this.mockSuppliers[index] = { ...supplier, id };
        // Wir geben eine Kopie zurück, um wieder doppelte Einträge zu vermeiden
        return of({ ...this.mockSuppliers[index] });
      }
      // Return an error Observable if supplier not found
      return throwError(() => new Error(`Supplier with ID ${id} not found`));
    }
    // real backend API call
    return this.http.put<Supplier>(`${this.baseUrl}/${id}`, supplier);
  }
}
