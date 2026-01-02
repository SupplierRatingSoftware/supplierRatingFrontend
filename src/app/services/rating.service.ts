import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Rating, RatingCreate } from '../models/rating.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ratings`;

  /**
   * POST /ratings
   * @description Creates a new rating for an order. The TotalScore will be calculated from the backend.
   */
  createRating(rating: RatingCreate): Observable<Rating> {
    if (environment.useMockData) {
      console.log('⚠️ Mocking createRating');
      return of({
        ...rating,
        id: `rate-mock-${Date.now()}`,
        code: `R-MOCK-${Date.now()}`,
        supplierId: `perm-${Date.now()}`,

        totalScore: (rating.quality + rating.cost + rating.deadline + rating.availability) / 4,
      } as Rating);
    }
    return this.http.post<Rating>(this.baseUrl, rating);
  }

  /**
   * GET /ratings/{id}
   * @description Retrieves a rating by its ID
   */
  getRatingById(id: string): Observable<Rating> {
    if (environment.useMockData) {
      console.log('⚠️ Mocking getRatingById for ID:', id);
      return of({
        id: id,
        code: `R-MOCK-${Date.now()}`,
        orderId: `ord-${Date.now()}`,
        supplierId: `perm-${Date.now()}`,
        quality: Math.floor(Math.random() * 5) + 1,
        cost: Math.floor(Math.random() * 5) + 1,
        deadline: Math.floor(Math.random() * 5) + 1,
        availability: Math.floor(Math.random() * 5) + 1,
        totalScore: 4,
        comment: 'Gute Lieferung, aber etwas teuer.',
      } as Rating);
    }
    return this.http.get<Rating>(`${this.baseUrl}/${id}`);
  }
}
