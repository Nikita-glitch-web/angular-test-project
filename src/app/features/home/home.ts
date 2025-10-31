import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { ArticleService, Article } from '../../core/services/article.service';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
  map,
} from 'rxjs/operators';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { SearchComponent } from './components/search-bar/search';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    ArticleCard,
    SearchComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  articles$!: Observable<Article[]>;
  searchTerm: string = '';
  private search$ = new Subject<string>();

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.articleService.fetchArticles();

    this.articles$ = this.search$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => this.articleService.getFilteredArticles(term)),
      map((articles) => articles.slice(0, 6))
    );
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.search$.next(term);
  }
}
