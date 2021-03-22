import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/category.interface';
import { TwitchService } from '../../services/twitch.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories?: Category[];

  constructor(private twitchService: TwitchService) { }

  ngOnInit(): void {
    this.twitchService.getCategories()
      .then(categories => this.categories = categories);
  }

}
