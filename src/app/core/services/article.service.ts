import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, takeUntil, Subject, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Article {
  id: number;
  title: string;
  summary: string;
  published_at: string;
  image_url: string;
  url: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}


@Injectable({ providedIn: 'root' })
export class ArticleService implements OnDestroy {
  private articles$ = new BehaviorSubject<Article[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private readonly API_URL = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  fetchArticles(): void {
    this.loading$.next(true);
    this.http
      .get<ApiResponse>(this.API_URL)
      .pipe(
        map((res) =>
          res.results.map((a) => ({
            id: a.id,
            title: a.title,
            summary: a.summary,
            published_at: a.published_at,
            image_url: a.image_url,
            url: a.url,
          }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (articles) => {
          this.articles$.next(articles);
          this.loading$.next(false);
        },
        error: (err) => {
          // TODO: Replace with better error handlnig such as sentry
          console.error('Error fetching articles', err);
          this.articles$.next([]);
          this.loading$.next(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getArticles(): Observable<Article[]> {
    return this.articles$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getFilteredArticles(term: string): Observable<Article[]> {
    return this.articles$.pipe(
      map((articles) => {
        if (!term) return articles;

        const keywords = term.toLowerCase().split(/[\s,]+/);

        return articles
          .map((article) => {
            let score = 0;
            const title = article.title.toLowerCase();
            const summary = article.summary.toLowerCase();

            keywords.forEach((k) => {
              if (title.includes(k)) score += 2;
              if (summary.includes(k)) score += 1;
            });

            return { ...article, score };
          })
          .filter((a) => a.score > 0)
          .sort((a, b) => b.score - a.score);
      })
    );
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.http
      .get<Article>(`${this.API_URL}/${id}`)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error(`Error fetching article with id ${id}`, error);
          return of(undefined);
        })
      );
  }
}
