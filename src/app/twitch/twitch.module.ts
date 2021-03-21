import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesComponent } from './pages/games/games.component';
import { ChannelsComponent } from './pages/channels/channels.component';
import { FollowsComponent } from './pages/follows/follows.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ThumbnailImagePipe } from './pipes/thumbnail-image.pipe';



@NgModule({
  declarations: [
    GamesComponent,
    ChannelsComponent,
    FollowsComponent,
    InicioComponent,
    ThumbnailImagePipe
  ],
  imports: [
    CommonModule
  ]
})
export class TwitchModule { }
