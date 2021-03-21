import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider  } from 'twitch-auth';

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

  getStreamById(id: string){
    return from(this.apiClient.helix.streams.getStreamByUserId(id));
  }

  getStreamByUserName(userName: string) {
    return from(this.apiClient.helix.users.getUserByName(userName));
  }

  getStreams() {
    return from(this.apiClient.helix.streams.getStreams());
  }
}
