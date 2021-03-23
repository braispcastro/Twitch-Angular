import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../../services/twitch.service';
import { Stream } from '../../interfaces/stream.interface';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  streams?: Stream[];
  
  constructor(private twitchService: TwitchService) { }

  ngOnInit(): void {
    this.twitchService.getFollowersForUser()
      .then(streams => {
        console.log(streams);
        this.streams = streams;
      });
  }

}
