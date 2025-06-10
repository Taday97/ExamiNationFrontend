// google-login-button.component.ts
import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  NgZone,
} from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-google-login-button',
  template: `<div id="googleBtn"></div>`,
  standalone: true,
})
export class GoogleLoginButtonComponent implements AfterViewInit {
  @Output() loginSuccess = new EventEmitter<string>();
  @Output() loginError = new EventEmitter<any>();

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id:
        '685435682005-6354qioaa2qtluergi1mrmndst7etrj1.apps.googleusercontent.com',
      callback: (response: any) =>
        this.zone.run(() => this.handleCredentialResponse(response)),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    google.accounts.id.disableAutoSelect();
    google.accounts.id.renderButton(document.getElementById('googleBtn'), {
      theme: 'outline',
      size: 'large',
      width: '100%',
    });
  }

  private handleCredentialResponse(response: any) {
    if (response.credential) {
      this.loginSuccess.emit(response.credential);
    } else {
      this.loginError.emit(response);
    }
  }
}
