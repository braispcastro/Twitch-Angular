import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ChannelsComponent } from './pages/channels/channels.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FollowsComponent } from './pages/follows/follows.component';
import { ThumbnailImagePipe } from './pipes/thumbnail-image.pipe';
import { ViewerCountPipe } from './pipes/viewer-count.pipe';
import { ChannelComponent } from './components/channel/channel.component';
import { CategoryComponent } from './components/category/category.component';



@NgModule({
  declarations: [
    InicioComponent,
    ChannelsComponent,
    CategoriesComponent,
    FollowsComponent,
    ChannelComponent,
    CategoryComponent,
    ThumbnailImagePipe,
    ViewerCountPipe
  ],
  imports: [
    CommonModule
  ]
})
export class TwitchModule { }
