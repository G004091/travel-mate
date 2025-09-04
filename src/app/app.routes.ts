import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'attraction-detail/:id',
    loadComponent: () => import('./pages/attraction-detail/attraction-detail.page').then(m => m.AttractionDetailPage)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage)
  }
];