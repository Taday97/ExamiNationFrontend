import { Test } from '@shared/interfaces/test.interface';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
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
import { TestImagePipe } from '@test/pipes/test-image.pipe';
import {
  ImageUploadComponent,
} from '@shared/components/image-upload/image-upload.component';
import { ImageUrl } from '@shared/interfaces/ImageUrl';
@Component({
  selector: 'app-test-admin-modal',
  imports: [
    DialogModule,
    FormsModule,
    FormErrorLabelComponent,
    CommonModule,
    ReactiveFormsModule,
    ImageUploadComponent,
  ],
  templateUrl: './test-admin-modal.component.html',
})
export class TestAdminModalComponent {
  constructor(private notificationService: NotificationService) {}
  @Output() refreshTrigger = new EventEmitter<boolean>();
  pipe = new TestImagePipe();

  dialog = signal(false);
  submitted = signal(false);
  previewImage = signal<ImageUrl>({ url: null });
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

      this.previewImage.set({ url: transformedUrl });
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

  onImageChanged(file: File | null) {
    this.imageFile.set(file);

    if (file) {
      this.imageUrlControl.setValue('');
    }
  }
  get imageUrlControl(): FormControl<string | null> {
    return this.testForm.get('imageUrl') as FormControl<string | null>;
  }
  clearImage() {
    this.previewImage.set({ url: null });
    this.imageFile.set(null);
    const imageControl = this.testForm.get('imageUrl');
    if (imageControl) {
      imageControl.setValue('');
      imageControl.markAsTouched();
      imageControl.markAsDirty();
      imageControl.updateValueAndValidity();
    }
  }
}
