import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../models/order.model';

/**
 * Service for providing mocked, async order-data.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  getOrders(): Observable<Order[]> {
    const mockOrders: Order[] = [
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
     * 'of()' takes data and packages it in an Observable.
     * For the component it looks exactly the same as if it came from the real server.
     */
    return of(mockOrders);
  }
}
