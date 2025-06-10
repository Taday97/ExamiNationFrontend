import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from "../../components/front-navbar/front-navbar.component";
import { FrontFooterComponent } from "../../components/front-footer/front-footer.component";

@Component({
  selector: 'standard.layout',
  imports: [RouterOutlet, FrontNavbarComponent, FrontFooterComponent],
  templateUrl: './standard.layout.component.html',
})
export class StandardLayoutComponent { }
