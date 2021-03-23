import { Component, OnInit } from '@angular/core';

import { TwitchService } from '../../services/twitch.service';
import { Stream } from '../../interfaces/stream.interface';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  streams?: Stream[];

  constructor(private twitchService: TwitchService) {}

  ngOnInit(): void {
    this.twitchService.getStreams()
      .then(streams => this.streams = streams);
  }
  
}
