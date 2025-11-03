import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ArticlesService } from './articles.service';
import { ApiResponse, Article } from './types';

@Injectable({ providedIn: 'root' })
export class ArticlesStore {
  private articles$ = new BehaviorSubject<Article[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);
  private currentPage$ = new BehaviorSubject<number>(1);
  private hasMore$ = new BehaviorSubject<boolean>(true);

  private readonly PAGE_SIZE = 30;

  constructor(private api: ArticlesService) {
    // @ts-ignore
    window.store = this;
  }

  fetchArticles(): void {
    this.currentPage$.next(1);
    this.hasMore$.next(true);
    this.articles$.next([]);
    this.loadNextPage();
  }

  loadNextPage(): void {
    if (this.loading$.value || !this.hasMore$.value) return;

    this.loading$.next(true);
    this.error$.next(null);

    const page = this.currentPage$.value;
    const limit = this.PAGE_SIZE;
    const offset = this.PAGE_SIZE * (this.currentPage$.value - 1);
    this.api.fetchArticlesApi(page, limit, offset).subscribe({
      next: (res: ApiResponse) => {
        const newArticles = res.results.map((a) => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          published_at: a.published_at,
          image_url: a.image_url,
          url: a.url,
        }));

        const merged = [
          ...this.articles$.value,
          ...newArticles.filter(
            (na) => !this.articles$.value.some((ea) => ea.id === na.id)
          ),
        ];

        this.articles$.next(merged);
        this.currentPage$.next(page + 1);
        this.loading$.next(false);
      },
      error: (err) => {
        this.error$.next('Error fetching articles');
        this.loading$.next(false);
      },
    });
  }

  getArticles(): Observable<Article[]> {
    return this.articles$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  hasMore(): Observable<boolean> {
    return this.hasMore$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
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

            return { article, score };
          })
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .map(({ article }) => article);
      })
    );
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.api.getArticleById(id);
  }
}
