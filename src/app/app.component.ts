import { Component, signal } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { LoadingService } from '@shared/services/loadingService.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers:[MessageService,ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'examiNation-fronted';
  loading = signal<boolean>(false);

  constructor(private router: Router, public loadingService: LoadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
  }
}
