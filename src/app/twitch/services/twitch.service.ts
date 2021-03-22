import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider  } from 'twitch-auth';
import { HelixPaginatedStreamFilter } from 'twitch/lib/API/Helix/Stream/HelixStreamApi';
import { Stream } from '../interfaces/stream.interface';

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
  
  async getStreamById(id: string){
    return this.apiClient.helix.streams.getStreamByUserId(id);
  }

  async getStreamByUserName(userName: string) {
    return this.apiClient.helix.users.getUserByName(userName);
  }

  async getStreams(): Promise<Stream[]> {
    const streams: Stream[] = [];

    if (!environment.production) {
      const savedStreams = JSON.parse(localStorage.getItem('streams')!)
      if (savedStreams) {
        console.log(savedStreams);
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
          .then(game => stream.game = game?.name ?? '-');'-';
      }

      await helixStream.getUser()
        .then(user => stream.logo = user?.profilePictureUrl ?? '');
      
      await helixStream.getTags()
        .then(tags => {
          for (const tag of tags) {
            if (tag.getName('es-es')) {
              stream.tags.push(tag.getName('es-es')!);
            }
          }
        });

      streams.push(stream);
    }

    localStorage.setItem('streams', JSON.stringify(streams))
    return streams;
  }

}
