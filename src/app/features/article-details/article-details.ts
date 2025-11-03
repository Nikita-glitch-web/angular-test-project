import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppMaterialModule } from '../../app-material.module';
import { CommonModule } from '@angular/common';
import { ArticlesStore, Article } from '../../core/articles';
import { take } from 'rxjs/operators';
import { LoremPipe } from '../../shared/pipes/lorem.pipe';
import { LoaderComponent } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-news-details',
  templateUrl: './article-details.html',
  styleUrls: ['./article-details.scss'],
  imports: [AppMaterialModule, CommonModule, LoaderComponent, LoremPipe],
})
export class ArticleDetails implements OnInit {
  id = signal<number>(0);
  article = signal<Article | undefined>(undefined);
  isLoading = signal(true);
  isError = signal(false);
  isNotFound = signal(false);

  constructor(
    private route: ActivatedRoute,
    private articlesStore: ArticlesStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.id.set(param ? Number(param) : 0);
    this.fetchArticle(this.id());
  }

  fetchArticle(id: number): void {
    this.isLoading.set(true);
    this.isError.set(false);
    this.isNotFound.set(false);

    this.articlesStore
      .getArticleById(id)
      .pipe(take(1))
      .subscribe({
        next: (article) => {
          this.article.set(article);
          if (!article) this.isNotFound.set(true);
          this.isLoading.set(false);
        },
        error: () => {
          this.isError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
