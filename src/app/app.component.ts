import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Twitch-Angular';

  constructor() {
    localStorage.setItem('user', 'cheisinilusions');
  }
}
