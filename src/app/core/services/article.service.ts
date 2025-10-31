import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  summary: string;
  published_at: string;
  image_url: string;
  url: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articles$ = new BehaviorSubject<Article[]>([]);
  private API_URL = 'https://api.spaceflightnewsapi.net/v4/articles/';

  constructor(private http: HttpClient) {}

  fetchArticles(): void {
    this.http.get<ApiResponse>(this.API_URL)
      .pipe(
        map(res => res.results.map(a => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          published_at: a.published_at,
          image_url: a.image_url,
          url: a.url
        })))
      )
      .subscribe({
        next: articles => this.articles$.next(articles),
        error: err => {
          console.error('Error fetching articles', err);
          this.articles$.next([]);
        }
      });
  }

  getArticles(): Observable<Article[]> {
    return this.articles$.asObservable();
  }

  getFilteredArticles(term: string): Observable<Article[]> {
    return this.articles$.pipe(
      map(articles => {
        if (!term) return articles;

        const keywords = term.toLowerCase().split(/[\s,]+/);

        return articles
          .map(article => {
            let score = 0;
            const title = article.title.toLowerCase();
            const summary = article.summary.toLowerCase();

            keywords.forEach(k => {
              if (title.includes(k)) score += 2;
              if (summary.includes(k)) score += 1;
            });

            return { ...article, score };
          })
          .filter(a => a.score > 0)
          .sort((a, b) => b.score - a.score);
      })
    );
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.articles$.pipe(
      map(articles => articles.find(a => a.id === id))
    );
  }
}
