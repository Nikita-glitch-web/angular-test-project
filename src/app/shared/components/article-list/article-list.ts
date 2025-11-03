import { Component, Input, OnInit } from '@angular/core';
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
  constructor(private articlesStore: ArticlesStore) {}

  ngOnInit(): void {
    this.articlesStore.fetchArticles();
    this.articles$ = this.articlesStore.getFilteredArticles(this.filter);
    this.isLoading$ = this.articlesStore.isLoading();
    this.hasMore$ = this.articlesStore.hasMore();
    this.error$ = this.articlesStore.getError();
  }

  loadMore(): void {
    this.articlesStore.loadNextPage();
  }
}
