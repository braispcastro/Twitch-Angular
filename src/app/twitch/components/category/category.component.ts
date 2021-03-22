import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Input()
  category!: Category;

  constructor() { }

  ngOnInit(): void {
  }

}
