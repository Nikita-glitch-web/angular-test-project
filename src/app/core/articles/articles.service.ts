import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Article } from './types';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly API_URL = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  fetchArticlesApi(
    page: number,
    limit: number,
    offset: number
  ): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(this.API_URL, { params });
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.http.get<Article>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(undefined);
        }
        console.error(`Error fetching article with id ${id}`, error);
        return throwError(() => error);
      })
    );
  }
}
