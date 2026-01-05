import { inject, Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';

/**
 * Service for providing mocked, async order-data.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  /**
   * Injected HttpClient
   * @private
   */
  private http = inject(HttpClient);

  /**
   * Base URL for orders API & headers
   * @private
   */
  private baseUrl = `${environment.apiUrl}/orders`;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  /**
   * Mocked order data
   * @private
   */
  private readonly mockOrders: Order[] = [
    {
      id: 'ord-1',
      code: 'ORD-2023-001',
      supplierId: 'perm-1', // Müller Baustoffe GmbH
      supplierName: 'Müller Baustoffe GmbH',
      name: 'Zementlieferung Mai',
      mainCategory: 'BESCHAFFUNG',
      subCategory: 'GERAET_WERKZEUG',
      reason: 'Bauprojekt Schulhaus Windisch',
      orderedBy: 'Hans Muster',
      orderDate: '2023-05-10',
      contactPerson: 'Anna Becker',
      contactEmail: 'anna.becker@gmx.ch',
      contactPhone: '+41 79 123 45 67',
      ratingStatus: 'RATED',
    },
    {
      id: 'ord-2',
      code: 'ORD-2023-002',
      supplierId: 'perm-1', // Müller Baustoffe GmbH
      supplierName: 'Müller Baustoffe GmbH',
      name: 'Ziegelsteine Q3',
      mainCategory: 'BESCHAFFUNG',
      subCategory: 'GERAET_WERKZEUG',
      reason: 'Lagerauffüllung',
      orderedBy: 'Hans Muster',
      orderDate: '2023-09-01',
      ratingStatus: 'PENDING',
    },
    {
      id: 'ord-3',
      code: 'ORD-2023-003',
      supplierId: 'perm-2', // Swiss Tech AG
      supplierName: 'Swiss Tech AG',
      name: 'Präzisionsfräsen Prototyp',
      mainCategory: 'DIENSTLEISTUNG',
      subCategory: 'BERATUNG',
      reason: 'Entwicklung neuer Messkopf',
      orderedBy: 'Julia Sommer',
      orderDate: '2023-11-15',
      ratingStatus: 'RATED',
    },
    {
      id: 'ord-4',
      code: 'ORD-2023-004',
      supplierId: 'perm-2', // Swiss Tech AG
      supplierName: 'Swiss Tech AG',
      name: 'Wartung Messgeräte',
      mainCategory: 'DIENSTLEISTUNG',
      subCategory: 'MESSGERAETE',
      reason: 'Jährliche Kalibrierung',
      orderedBy: 'Max Tech',
      orderDate: '2023-12-10',
      contactPerson: 'Anna Becker',
      contactEmail: 'anna.becker@gmx.ch',
      contactPhone: '+41 79 123 45 67',
      ratingStatus: 'PENDING',
    },
  ];

  /**
   * GET /orders
   */
  getOrders(): Observable<Order[]> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Using Mock Data for getOrders');
      return of(this.mockOrders);
    }
    // real backend API call
    return this.http.get<Order[]>(this.baseUrl, { headers: this.headers });
  }

  /**
   * POST /orders
   */
  addOrder(order: Order): Observable<Order> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Using Mock Data for createOrder');
      // we simulate a new object to be returned with an ID
      const newMockOrder: Order = {
        ...order,
        id: `mock-id-${Date.now()}`,
        code: `MOCK-${Date.now()}`,
      };
      // push freshly created order to mockOrders array
      this.mockOrders.push(newMockOrder);

      return of(newMockOrder);
    }
    // real backend API call
    return this.http.post<Order>(this.baseUrl, order, { headers: this.headers });
  }

  /**
   * GET /orders/{id}
   * @description Retrieves a supplier by its ID
   */
  getOrderById(id: string): Observable<Order> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      console.log('⚠️ Mocking Data for getOrderById with ID:', id);
      // find the supplier in the mockOrders array
      const mockOrder = this.mockOrders.find(s => s.id === id);
      // return the found supplier or the first supplier in the array
      return of(mockOrder || this.mockOrders[0]);
    }
    // real backend API call
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /orders/{id}
   * @description Updates an existing supplier
   */
  updateOrder(id: string, order: Order): Observable<Order> {
    // if mock data is enabled, return mock data
    if (environment.useMockData) {
      const index = this.mockOrders.findIndex(o => o.id === id);
      console.log('⚠️ Mocking Data for updateSupplier with ID:', id);
      if (index !== -1) {
        // Wir überschreiben den alten Eintrag im Array
        this.mockOrders[index] = { ...order, id };
        // Wir geben eine Kopie zurück, um wieder doppelte Einträge zu vermeiden
        return of({ ...this.mockOrders[index] });
      }
      // Return an error Observable if supplier not found
      return throwError(() => new Error(`Supplier with ID ${id} not found`));
    }
    // real backend API call
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }
}
