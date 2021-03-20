import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './twitch/pages/inicio/inicio.component';
import { ChannelsComponent } from './twitch/pages/channels/channels.component';
import { GamesComponent } from './twitch/pages/games/games.component';
import { FollowsComponent } from './twitch/pages/follows/follows.component';


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
    path: 'games',
    component: GamesComponent,
  },
  {
    path: 'follows',
    component: FollowsComponent,
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
