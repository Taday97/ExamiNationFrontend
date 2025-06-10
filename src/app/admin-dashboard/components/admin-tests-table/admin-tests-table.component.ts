import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { TestsService } from '@test/services/tests.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Test, TestType } from '@test/interfaces/test.interface';
import { TestImagePipe } from '@test/pipes/test-image.pipe';

import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'app-admin-tests-table',
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    CommonModule,
    FormsModule,
    CommonModule,
    TestImagePipe,
    ToolbarModule,
    ButtonModule,
    TableModule,
    FileUploadModule,
    InputTextModule,
    RatingModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    InputNumberModule,
    TextareaModule,
    DropdownModule,
    SelectButtonModule,
    InputIconModule,
    IconFieldModule,
    ToggleSwitchModule,
    CardModule,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ToastModule,
  ],
  templateUrl: './admin-tests-table.component.html',
  providers: [MessageService, ConfirmationService],
})
export class TestAdminCrudComponent implements OnInit {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // === Signals & State ===
  dialog = signal(false);
  submitted = signal(false);
  previewImage = signal<string | null>(null);
  isDragOver = signal(false);
  loading = signal(false);
  tempImages = signal<string>('');
  imageFileList: FileList | undefined = undefined;
  tests: Test[] = [];
  totalRecords = 0;
  isFiltering = signal(false);
  wasSaved = signal(false);
  showDeleteModal = signal(false);
  itemToDeleteId = signal<string | null>(null);

  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('name');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  // === Enums ===
  TestType = TestType;

  // === Injected Services ===
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private testsService = inject(TestsService);
  testImagePipe = inject(TestImagePipe);
  // === Form ===
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

  setFormValue(formLike: Partial<Test>) {
    this.testForm.reset(formLike as any);
    const transformedUrl = formLike.imageUrl? this.testImagePipe.transform(formLike.imageUrl!):null;
    this.previewImage.set(transformedUrl);
  }
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

  ngOnInit(): void {
    this.setFormValue(this.test());
  }

  // === Options ===
  testTypeOptions = Object.keys(TestType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: TestType[key as keyof typeof TestType],
    }));

  // === Editable Test ===
  defaultTest: Test = {
    id: 'new',
    name: '',
    description: '',
    type: TestType.IQ,
    imageUrl: '',
    createdAt: new Date(),
  };
  test = signal<Test>({ ...this.defaultTest });
  imageFile = signal<File | null>(null);

  async onSubmit() {
    this.testForm.markAllAsTouched();

    if (!this.testForm.valid) return;

    const formValue = this.testForm.value;
    const testLike: Partial<Test> = { ...(formValue as any) };

    try {
      if (testLike.id === '' || testLike.id === 'new') {
        // Crear test
        const test = await firstValueFrom(
          this.testsService.createTest(testLike, this.imageFile())
        );
        this.router.navigate(['/admin/tests', test.id]);
      } else {
        await firstValueFrom(
          this.testsService.updateTest(
            this.test().id,
            testLike,
            this.imageFile()
          )
        );
      }


      this.closeModal();
      this.resetForm();

      this.refreshTrigger.update((prev) => !prev);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Test loaded successfully',
      });
    } catch (err: any) {
      console.error('Error al guardar:' + err.error.message);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed '+err.error.message,
      });
    }
  }
  async editItem(id: string) {
    if (!id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'ID inválido',
      });
      return;
    }

    try {
      const test = await firstValueFrom(this.testsService.getTestById(id));
      console.log('Test update' + test.id);

      if (!test) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontró el test',
        });
        return;
      }
      this.test.set(test);
      this.setFormValue(test);
      this.openModal();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load the test',
      });
    }
  }

  // === Resource Loader ===
  testsResource = rxResource({
    request: computed(() => ({
      pageNumber: this.pageNumber(),
      sortBy: this.sortField(),
      sortDescending: this.sortDescending(),
      filters: this.filters(),
      pageSize: this.pageSize(),
      refresh: this.refreshTrigger(),
    })),
    loader: ({ request }) => {
      this.loading.set(true);
      return this.testsService.getTestPage(request).pipe(
        map((res) => {
          this.loading.set(false);
          this.totalRecords = res.data.totalCount;
          console.log(res.data.items);
          return res.data.items;
        }),
        catchError((err) => {
          this.loading.set(false);
          console.error(err);
          return of([]);
        })
      );
    },
  });
  testItemResource = rxResource({
    request: () => ({ id: this.test().id }),
    loader: ({ request }) => {
      return this.testsService.getTestById(request.id);
    },
  });

  // === Dialog Methods ===
  openModal() {
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }
  // Abrir modal
  openDeleteModal(id: string) {
    this.itemToDeleteId.set(id);
    this.showDeleteModal.set(true);
  }

  // Cerrar modal
  closeDeleteModal() {
    this.itemToDeleteId.set(null);
    this.showDeleteModal.set(false);
  }
  async confirmDeleteConfirmed() {
    if (!this.itemToDeleteId) return;

    try {
      await firstValueFrom(
        this.testsService.deleteTest(this.itemToDeleteId()!)
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Test deleted successfully',
      });

      this.refreshTrigger.update((prev) => !prev);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error deleting test',
      });
    } finally {
      this.closeDeleteModal();
    }
  }

  // === File/Image Methods ===
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

  clearImage() {
    this.imageFile.set(null);
    this.previewImage.set(null);
    this.testForm.get('imageUrl')?.setValue('');
    this.testForm.get('imageUrl')?.markAsTouched();
    this.testForm.get('imageUrl')?.updateValueAndValidity();
  }

  // === Table + Pagination ===
  loadTestsLazy(event: any) {
    this.pageNumber.set(event.first / event.rows + 1);
    this.sortField.set(event.sortField || 'name');
    this.sortDescending.set(event.sortOrder !== 1);
    const updatedFilters: { [key: string]: string } = {};
    for (const key in event.filters) {
      const filterValue = event.filters[key]?.value;
      if (filterValue) {
        updatedFilters[key] = filterValue;
      }
    }
    this.filters.set(updatedFilters);
  }

  onFilter(event: any, field: string) {
    const value = event.target.value;
    const current = { ...this.filters() };
    current[field] = value;
    this.filters.set(current);
    this.pageNumber.set(1);
  }

  onTableFilter(event: any): void {
    const filters = event?.filters || {};
    this.isFiltering.set(
      Object.values(filters).some(
        (f: any) => f?.value?.toString().trim() !== ''
      )
    );
  }
}
