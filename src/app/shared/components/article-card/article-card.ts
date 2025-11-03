import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../../app-material.module';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { TrimPipe } from '../../pipes/trim.pipe';
import { Article } from '../../../core/articles';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, AppMaterialModule, HighlightPipe, TrimPipe],
  templateUrl: './article-card.html',
  styleUrls: ['./article-card.scss'],
})
export class ArticleCard {
  @Input() article: Article | null = null;
  @Input() filter: string = '';

  constructor(private router: Router) {}

  openDetail() {
    if (!this.article) return;
    this.router.navigate(['/article', this.article.id]);
  }
}
