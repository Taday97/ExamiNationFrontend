import { Test } from '@shared/interfaces/test.interface';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { TestType } from '@shared/interfaces/test.interface';
import { firstValueFrom } from 'rxjs';
import { TestsService } from '@shared/services/tests.service';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { handle } from 'src/app/utils/handle.helper';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TestImagePipe } from '@test/pipes/test-image.pipe';

@Component({
  selector: 'app-admin-test-modal',
  imports: [
    DialogModule,
    FormsModule,
    FormErrorLabelComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService, NotificationService],
  templateUrl: './admin-test-modal.component.html',
})
export class AdminTestModalComponent {
  constructor(private notificationService: NotificationService) {}
  @Output() refreshTrigger = new EventEmitter<boolean>();
  pipe = new TestImagePipe();

  dialog = signal(false);
  submitted = signal(false);
  previewImage = signal<string | null>(null);
  isDragOver = signal(false);
  imageFile = signal<File | null>(null);

  private fb = inject(FormBuilder);
  testsService = inject(TestsService);

  test = signal<Test | null>(null);
  currentTest = this.test();
  isNew = !this.currentTest || this.currentTest.id === 'new';

  testTypeOptions = Object.keys(TestType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: TestType[key as keyof typeof TestType],
    }));

  testForm = this.fb.group({
    id: [''],
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    description: ['', [Validators.maxLength(500)]],
    type: [TestType.IQ, Validators.required],
    imageUrl: ['', [FormUtils.imageValidator]],
  });

  resetForm() {
    this.testForm.reset({
      id: '',
      name: '',
      description: '',
      type: TestType.IQ,
      imageUrl: '',
    });
    this.clearImage();
  }

  async loadTest(id: string) {
    try {
      const test = await firstValueFrom(this.testsService.getById(id));
      this.test.set(test);
      this.testForm.patchValue(test);

      const transformedUrl = test.imageUrl
        ? this.pipe.transform(test.imageUrl!)
        : null;

      this.previewImage.set(transformedUrl || null);
    } catch (error) {
      this.notificationService.error('Failed to load test data');
    }
  }
  openModal(test?: Test) {
    if (test) {
      this.loadTest(test!.id);
    } else {
      this.test.set(null);
      this.resetForm();
    }
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }

  async onSubmit() {
    this.testForm.markAllAsTouched();
    if (!this.testForm.valid) return;

    const formValue = this.testForm.value;
    const testLike: Partial<Test> = { ...(formValue as any) };

    const currentTest = this.test();
    const isNew = !currentTest || currentTest.id === 'new';

    const task = () => {
      if (isNew) {
        return firstValueFrom(
          this.testsService.createTest(testLike, this.imageFile())
        );
      } else {
        return firstValueFrom(
          this.testsService.updateTest(
            currentTest!.id,
            testLike,
            this.imageFile()
          )
        );
      }
    };

    await handle(
      task,
      'Test saved successfully',
      this.notificationService,
      'Failed to save test'
    );

    this.closeModal();
    this.resetForm();
    this.refreshTrigger.emit();
  }

  clearImage() {
    const imageControl = this.testForm.get('imageUrl');
    this.previewImage.set(null);
    this.imageFile.set(null);

    if (imageControl) {
      imageControl.setValue('');
      imageControl.markAsTouched();
      imageControl.markAsDirty();
      imageControl.updateValueAndValidity();
    }
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
    console.log('imageFile' + this.imageFile());
    if (this.imageFile()) {
      this.previewImage.set(URL.createObjectURL(this.imageFile()!));
    }
  }
}
