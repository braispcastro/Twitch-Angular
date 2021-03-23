import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './twitch/pages/inicio/inicio.component';
import { ChannelsComponent } from './twitch/pages/channels/channels.component';
import { CategoriesComponent } from './twitch/pages/categories/categories.component';


const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    pathMatch: 'full'
  },
  {
    path: 'channels',
    component: ChannelsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule { }
