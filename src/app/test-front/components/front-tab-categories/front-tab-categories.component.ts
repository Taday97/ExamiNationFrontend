import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TestType } from '@shared/interfaces/test.interface';

@Component({
  selector: 'front-tab-categories',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './front-tab-categories.component.html',
})
export class FrontTabCategoriesComponent {
  testType=TestType
 }
