import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ArticleDetails } from './features/article-details/article-details';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'article/:id',
    component: ArticleDetails,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
