import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading = signal<boolean>(false);
  progress = signal<boolean>(false);
  message = signal<string>('Loading...');

  setMessage(value: string) {
    this.message.set(value);
  }

  getMessage() {
    return this.message();
  }

  show() {
    this.loading.set(true);
  }

  hide() {
    this.loading.set(false);
  }

  isLoading() {
    return this.loading();
  }

  showProgress() {
    this.progress.set(true);
  }
  hideProgress() {
    this.progress.set(false);
  }
  isProgress() {
    return this.progress();
  }
}
