import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { SearchComponent } from './components/search-bar/search';
import { ArticleList } from '../../shared/components/article-list/article-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    SearchComponent,
    ArticleList
],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  searchTerm: string = '';

  onSearchChange(term: string) {
    this.searchTerm = term;
  }
}
