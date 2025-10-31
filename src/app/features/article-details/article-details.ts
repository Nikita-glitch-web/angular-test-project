import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppMaterialModule } from '../../app-material.module';
import { CommonModule } from '@angular/common';
import { ArticleService, Article } from '../../core/services/article.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-news-details',
  templateUrl: './article-details.html',
  styleUrls: ['./article-details.scss'],
  imports: [AppMaterialModule, CommonModule],
})
export class ArticleDetails implements OnInit {
  id: number | null = null;
  article: Article | undefined;
  isLoading = false;
  isError = false;
  isNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    console.log('route id raw:', param);
    this.id = param ? Number(param) : null;
    console.log('parsed id:', this.id);

    if (!this.id) {
      this.isNotFound = true;
      return;
    }

    this.fetchArticle(this.id);
  }

  private fetchArticle(id: number) {
    this.isLoading = true;
    this.isError = false;
    this.isNotFound = false;

    this.articleService.getArticleById(id)
      .pipe(take(1))
      .subscribe({
        next: (article) => {
          console.log('article received:', article);
          this.article = article ?? undefined;

          if (!article) {
            this.isNotFound = true;
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('failed to load article', err);
          this.isError = true;
          this.isLoading = false;
        }
      });
  }
}
