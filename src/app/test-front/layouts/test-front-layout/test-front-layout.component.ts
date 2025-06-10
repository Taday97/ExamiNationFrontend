import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from "@test-front/components/front-navbar/front-navbar.component";
import { FrontHeroComponent } from "@test-front/components/front-hero/front-hero.component";
import { FrontCategoriesComponent } from "@test-front/components/front-categories/front-categories.component";
import { FrontFeaturesComponent } from "@test-front/components/front-features/front-features.component";
import { FrontFooterComponent } from "@test-front/components/front-footer/front-footer.component";

@Component({
  selector: 'app-test-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent, FrontHeroComponent, FrontCategoriesComponent, FrontFeaturesComponent, FrontFooterComponent],
  templateUrl: './test-front-layout.component.html',
})
export class TestFrontLayoutComponent { }
