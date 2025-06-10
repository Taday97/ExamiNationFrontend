import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-tests-header',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ToggleSwitchModule,
    FormsModule,
    ImageModule,
  ],
  templateUrl: './admin-tests-header.component.html',
})
export class AdminTestsHeaderComponent {
  authService = inject(AuthService);
}
