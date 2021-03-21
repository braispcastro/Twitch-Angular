import { Component, OnInit } from '@angular/core';
import { HelixStream, HelixUser } from 'twitch/lib';
import { TwitchService } from '../../services/twitch.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  streams!: HelixStream[];

  constructor(private twitchService: TwitchService) {

  }

  ngOnInit(): void {
    this.twitchService.getStreams()
      .subscribe(({data}) => {
        this.streams = data
        // console.log(data);
      });
  }

}
