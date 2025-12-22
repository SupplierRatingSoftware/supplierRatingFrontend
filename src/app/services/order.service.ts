import { inject, Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

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
      name: 'Laborausrüstung Q1',
      orderDate: '2023-11-15',
      ratingStatus: 'PENDING',
      mainCategory: 'BESCHAFFUNG',
      orderedBy: 'Max Mustermann',
    },
    {
      id: 'ord-2',
      code: 'ORD-2023-002',
      name: 'Chemikalien Jahresbedarf',
      orderDate: '2023-10-01',
      ratingStatus: 'RATED',
      mainCategory: 'VERBRAUCHSMATERIAL',
      orderedBy: 'Julia Sommer',
    },
    {
      id: 'ord-3',
      code: 'ORD-2023-003',
      name: 'IT-Hardware Laptops',
      orderDate: '2023-12-05',
      ratingStatus: 'PENDING',
      mainCategory: 'IT',
      orderedBy: 'Admin',
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
}
