import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ImageUrl } from '@shared/interfaces/ImageUrl';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent {
  formControl = input.required<FormControl<string | null> | null>();
  isDragOver = signal(false);
  previewImage = signal<string | null>(null);
  imageFile = signal<File | null>(null);
  imageUrl = input.required<ImageUrl>();
  @Output() imageChanged = new EventEmitter<File | null>();

  constructor() {
    effect(() => {
      console.log('imageUrl', this.imageUrl());
      this.previewImage.set(this.imageUrl().url);
    });

  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readImage(file);
  }

  private readImage(file: File): void {
    if (!file.type.startsWith('image/')) {
      console.warn('Not an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    const imageUrls = Array.from(fileList ?? []).map((file) =>
      this.imageFile.set(file)
    );
    if (this.imageFile()) {
      this.previewImage.set(URL.createObjectURL(this.imageFile()!));
      this.imageChanged.emit(this.imageFile());
    }
  }
  clearImage() {
    this.previewImage.set(null);
    this.imageFile.set(null);
    this.imageChanged.emit(null);
  }
}
