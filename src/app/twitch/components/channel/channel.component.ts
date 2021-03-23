import { Component, Input, OnInit } from '@angular/core';
import { Stream } from '../../interfaces/stream.interface';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  @Input()
  stream!: Stream;

  constructor() { }

  ngOnInit(): void {

  }

  goToChannel() {
    window.location.href= `https://www.twitch.tv/${this.stream.channel}`;
  }

  goToCategory() {
    window.location.href= `https://www.twitch.tv/directory/game/${this.stream.game}`;
  }

}
