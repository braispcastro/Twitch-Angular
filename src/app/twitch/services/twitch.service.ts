import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider  } from 'twitch-auth';
import { HelixPaginatedStreamFilter } from 'twitch/lib/API/Helix/Stream/HelixStreamApi';
import { Stream } from '../interfaces/stream.interface';
import { Category } from '../interfaces/category.interface';
import { HelixPagination } from 'twitch/lib/API/Helix/HelixPagination';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  client_id: string = 'u5v6dje95lyef83pr3cql1h10be60p';
  client_secret: string = 'laekrrowqci8vihp1tvwoga7hrcr1b';

  apiClient!: ApiClient;

  constructor() {
    const authProvider = new ClientCredentialsAuthProvider(this.client_id, this.client_secret);
    this.apiClient = new ApiClient({ authProvider });
  }

  async getStreams(): Promise<Stream[]> {
    const streams: Stream[] = [];

    if (!environment.production) {
      const savedStreams = JSON.parse(localStorage.getItem('streams')!)
      if (savedStreams) {
        return savedStreams;
      }
    }

    const filter: HelixPaginatedStreamFilter = {
      limit: "24"
    }

    const helixStreams = await this.apiClient.helix.streams.getStreams(filter);
    
    for (const helixStream of helixStreams.data) {
      const stream: Stream = {
        channel: helixStream.userDisplayName,
        game: '',
        logo: '',
        preview: helixStream.thumbnailUrl,
        tags: [],
        title: helixStream.title,
        viewers: helixStream.viewers.toString()
      };

      if (helixStream.gameId) {
        await helixStream.getGame()
          .then(game => {
            if (game) {
              stream.game = game.name;
            }
          });
      }

      await helixStream.getUser()
        .then(user => stream.logo = user?.profilePictureUrl ?? '');
      
      await helixStream.getTags()
        .then(tags => {
          for (const tag of tags) {
            const tagName = tag.getName('en-us');
            if (tagName) {
              stream.tags.push(tagName);
            }
          }
        });

      streams.push(stream);
    }

    if (!environment.production) {
      localStorage.setItem('streams', JSON.stringify(streams))
    }

    return streams;
  }

  async getCategories(): Promise<Category[]> {
    const categories: Category[] = [];

    if (!environment.production) {
      const savedCategories = JSON.parse(localStorage.getItem('categories')!)
      if (savedCategories) {
        return savedCategories;
      }
    }

    const filter: HelixPagination = {
      limit: "60"
    }

    const helixCategories = await this.apiClient.helix.games.getTopGames(filter);
    for (const helixCategory of helixCategories.data) {
      const category: Category = {
        name: helixCategory.name,
        preview: helixCategory.boxArtUrl
      }

      categories.push(category);
    }

    if (!environment.production) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }

    return categories;
  }

}
