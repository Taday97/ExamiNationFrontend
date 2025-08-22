import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { ImageUrl } from '@shared/interfaces/ImageUrl';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent implements ControlValueAccessor {
  formControl = input.required<FormControl<string | null> | null>();
  isDragOver = signal(false);
  previewImage = signal<string | null>(null);
  imageFile = signal<File | null>(null);
  imageUrl = input.required<ImageUrl>();
  @Output() imageChanged = new EventEmitter<File | null>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Callbacks de ControlValueAccessor
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      console.log('imageUrl', this.imageUrl());
      this.previewImage.set(this.imageUrl().url);
    });
  }

  // --- Métodos ControlValueAccessor ---
  writeValue(obj: string | null): void {
    // Esto se llama cuando el FormControl cambia desde fuera
    this.previewImage.set(obj);
  }

  registerOnChange(fn: any): void {
    // Guardamos la función para notificar cambios al FormControl
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Guardamos la función para marcar el control como "tocado"
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Opcional: si quieres deshabilitar el input
    if (this.fileInput) {
      this.fileInput.nativeElement.disabled = isDisabled;
    }
  }

  // --- Drag & drop / file input ---
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

  onFilesChanged(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.readImage(file);
  }

  private readImage(file: File) {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      this.previewImage.set(url);

      // Notificamos al FormControl
      this.onChange(url);
      this.onTouched();

      // Emitimos el archivo para el backend
      this.imageFile.set(file);
      this.imageChanged.emit(file);
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.previewImage.set(null);
    this.imageFile.set(null);

    // Notificamos al FormControl que está vacío
    this.onChange(null);
    this.onTouched();

    this.imageChanged.emit(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
