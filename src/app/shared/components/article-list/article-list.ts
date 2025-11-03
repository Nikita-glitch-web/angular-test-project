import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesStore } from '../../../core/articles/articles.store';
import { Article } from '../../../core/articles/types';
import { Observable } from 'rxjs';
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
export class ArticleList implements OnInit {
  @Input() filter: string = '';
  articles$!: Observable<Article[]>;
  isLoading$!: Observable<boolean>;
  hasMore$!: Observable<boolean>;
  error$!: Observable<string | null>;
  private lastScrollTop = 0;

  constructor(private articlesStore: ArticlesStore) {}

  ngOnInit(): void {
    this.articlesStore.fetchArticles();
    this.articles$ = this.articlesStore.getFilteredArticles(this.filter);
    this.isLoading$ = this.articlesStore.isLoading();
    this.hasMore$ = this.articlesStore.hasMore();
    this.error$ = this.articlesStore.getError();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 300;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;
    if (window.scrollY > this.lastScrollTop) {
      if (height - position < threshold) {
        this.articlesStore.loadNextPage();
      }
    }
    this.lastScrollTop = window.scrollY;
  }
}
