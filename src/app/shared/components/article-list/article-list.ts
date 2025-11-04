import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ArticlesStore } from '../../../core/articles/articles.store';
import { Article } from '../../../core/articles/types';
import { ArticleCard } from '../article-card/article-card';
import { AppMaterialModule } from '../../../app-material.module';
import { LoaderComponent } from '../loader/loader';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ArticleCard, AppMaterialModule, LoaderComponent],
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.scss'],
})
export class ArticleList implements OnInit, OnChanges {
  @Input() filter: string = '';

  private filterSignal = signal('');
  private baseArticles$!: Signal<Article[]>;
  articles$!: Signal<Article[]>;
  isLoading$!: Signal<boolean>;
  hasMore$!: Signal<boolean>;
  error$!: Signal<string | null>;

  constructor(private articlesStore: ArticlesStore) {
    this.baseArticles$ = toSignal(this.articlesStore.getArticles(), {
      initialValue: [],
    });
    this.articles$ = computed(() =>
      this.filterArticles(this.baseArticles$(), this.filterSignal())
    );
    this.isLoading$ = toSignal(this.articlesStore.isLoading(), {
      initialValue: false,
    });
    this.hasMore$ = toSignal(this.articlesStore.hasMore(), {
      initialValue: true,
    });
    this.error$ = toSignal(this.articlesStore.getError(), {
      initialValue: null,
    });
  }

  ngOnInit(): void {
    this.articlesStore.fetchArticles();
    this.filterSignal.set(this.filter);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.filterSignal.set(this.filter);
    }
  }

  loadMore(): void {
    this.articlesStore.loadNextPage();
  }

  private filterArticles(articles: Article[], term: string): Article[] {
    if (!term) return articles;
    const keywords = term.toLowerCase().split(/\s|,/).filter(Boolean);
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
  }
}
