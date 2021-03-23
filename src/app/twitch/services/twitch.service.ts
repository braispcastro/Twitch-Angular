import { Injectable } from '@angular/core';
import { ApiClient, HelixStream, UserNameResolvable } from 'twitch';
import { ClientCredentialsAuthProvider  } from 'twitch-auth';
import { HelixPaginatedStreamFilter } from 'twitch/lib/API/Helix/Stream/HelixStreamApi';
import { Stream } from '../interfaces/stream.interface';
import { Category } from '../interfaces/category.interface';
import { HelixPagination } from 'twitch/lib/API/Helix/HelixPagination';
import { HelixFollowFilter } from 'twitch/lib/API/Helix/User/HelixFollow';

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

  // Obtener la lista de canales con más visitas
  async getStreams(): Promise<Stream[]> {
    const streams: Stream[] = [];
    let isNewList: boolean = false;

    // Se comprueba si han pasado más de 5 minutos desde la ultima petición de canales
    const streamsTimeSaved = new Date(localStorage.getItem('streamsTimeSaved')!);
    streamsTimeSaved.setMinutes(streamsTimeSaved.getMinutes() + 5);
    if (streamsTimeSaved > new Date()) {
      const savedStreams: Promise<Stream[]> = new Promise((resolve) => {
        setTimeout(() => {
          resolve(JSON.parse(localStorage.getItem('streams')!));
        }, 100);
      }); 

      if (savedStreams) {
        return savedStreams;
      }
    }

    const filter: HelixPaginatedStreamFilter = {
      limit: "24"
    }

    isNewList = true;
    const helixStreams = await this.apiClient.helix.streams.getStreams(filter);
    
    for (const helixStream of helixStreams.data) {
      const stream: Stream = {
        channel_name: helixStream.userName,
        display_name: helixStream.userDisplayName,
        game: '',
        logo: '',
        preview: helixStream.thumbnailUrl,
        tags: [],
        title: helixStream.title,
        viewers: helixStream.viewers.toString()
      };

      // Se obtiene el juego
      if (helixStream.gameId) {
        await helixStream.getGame()
          .then(game => {
            if (game) {
              stream.game = game.name;
            }
          });
      }

      // Se obtiene el usuario
      await helixStream.getUser()
        .then(user => stream.logo = user?.profilePictureUrl ?? '');
      
      // Se obtienen los tags
      await helixStream.getTags()
        .then(tags => {
          for (const tag of tags) {
            const tagName = tag.getName('en-us');
            if (tagName) {
              stream.tags.push(tagName);
            }
          }
        });
      
      // Se añade el objeto a la lista de streams
      streams.push(stream);
    }

    if (isNewList) {
      localStorage.setItem('streamsTimeSaved', new Date().toString());
      localStorage.setItem('streams', JSON.stringify(streams));
    }

    return streams;
  }

  // Obtener la lista de categorías más vistas
  async getCategories(): Promise<Category[]> {
    const categories: Category[] = [];
    let isNewList: boolean = false;

    // Se comprueba si han pasado más de 5 minutos desde la ultima petición de canales
    const categoriesTimeSaved = new Date(localStorage.getItem('categoriesTimeSaved')!);
    categoriesTimeSaved.setMinutes(categoriesTimeSaved.getMinutes() + 5);
    if (categoriesTimeSaved > new Date()) {
      const savedCategories = JSON.parse(localStorage.getItem('categories')!)
      if (savedCategories) {
        return savedCategories;
      }
    }

    const filter: HelixPagination = {
      limit: "60"
    }

    isNewList = true;
    const helixCategories = await this.apiClient.helix.games.getTopGames(filter);

    for (const helixCategory of helixCategories.data) {
      const category: Category = {
        name: helixCategory.name,
        preview: helixCategory.boxArtUrl
      }

      categories.push(category);
    }

    if (isNewList) {
      localStorage.setItem('categoriesTimeSaved', new Date().toString());
      localStorage.setItem('categories', JSON.stringify(categories))
    }

    return categories;
  }

  // Obtener la lista de canales online seguidos por mi
  async getFollowersForUser(): Promise<Stream[]> {

    let isNewList: boolean = false;
    const userName = localStorage.getItem('user')!;
    const userNameResolvable: UserNameResolvable = {
      name: userName
    }

    // Se comprueba si han pasado más de 5 minutos desde la ultima petición de canales
    const streamsTimeSaved = new Date(localStorage.getItem('followsTimeSaved')!);
    streamsTimeSaved.setMinutes(streamsTimeSaved.getMinutes() + 5);
    if (streamsTimeSaved > new Date()) {
      const savedStreams: Promise<Stream[]> = new Promise((resolve) => {
        setTimeout(() => {
          resolve(JSON.parse(localStorage.getItem('follows')!));
        }, 100);
      }); 

      if (savedStreams) {
        return savedStreams;
      }
    }

    const helixUser = await this.apiClient.helix.users.getUserByName(userNameResolvable);
    if (!helixUser) {
      return [];
    }
    
    const helixFollowFilter: HelixFollowFilter = {
      user: {
        id: helixUser!.id
      }
    }

    isNewList = true;
    const helixFollows = await this.apiClient.helix.users.getFollowsPaginated(helixFollowFilter).getAll();

    let hStreams: HelixStream[] = [];
    const channelsId: string[] = [];
    helixFollows.forEach(x => channelsId.push(x.followedUserId));
    const iterations: number = Math.ceil(channelsId.length / 100);
    for (let i = 0; i < iterations; i++) {
      const helixPaginatedStreamFilter: HelixPaginatedStreamFilter = {
        userId: channelsId.splice(0, 100)
      }
      const helixStreams = await this.apiClient.helix.streams.getStreams(helixPaginatedStreamFilter);
      hStreams = hStreams.concat(helixStreams.data);
    }

    let streams: Stream[] = [];
    for (const hs of hStreams) {
      const stream: Stream = {
        channel_name: hs.userName,
        display_name: hs.userDisplayName,
        game: hs.gameId,
        logo: '',
        preview: hs.thumbnailUrl,
        tags: [],
        title: hs.title,
        viewers: hs.viewers.toString()
      }

      // Se obtiene el juego
      if (hs.gameId) {
        await hs.getGame()
          .then(game => {
            if (game) {
              stream.game = game.name;
            }
          });
      }

      // Se obtiene el usuario
      await hs.getUser()
        .then(user => stream.logo = user?.profilePictureUrl ?? '');
      
      // Se obtienen los tags
      await hs.getTags()
        .then(tags => {
          for (const tag of tags) {
            const tagName = tag.getName('en-us');
            if (tagName) {
              stream.tags.push(tagName);
            }
          }
        });

      streams.push(stream)
    }

    streams.sort((a, b) => (parseInt(a.viewers) > parseInt(b.viewers) ? -1 : 1));

    if (isNewList) {
      localStorage.setItem('followsTimeSaved', new Date().toString());
      localStorage.setItem('follows', JSON.stringify(streams));
    }

    return streams;
  }

}
