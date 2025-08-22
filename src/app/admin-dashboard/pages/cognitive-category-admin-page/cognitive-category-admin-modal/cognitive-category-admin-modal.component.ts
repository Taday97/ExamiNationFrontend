import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { TestsResponse, TestType } from '@shared/interfaces/test.interface';
import { DropdownModule } from 'primeng/dropdown';
import { OptionData } from '@shared/interfaces/option.interface';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CognitiveCategory } from '@shared/interfaces/cognitve-category';
import { CognitiveCategoryService } from '@admin-dashboard/services/cognitive-category.service';
import { enumToOptions } from 'src/app/utils/enum-utils';
import { FormErrorService } from '@shared/services/form-error.service';
import { submitForm } from 'src/app/utils/submit-form.helper';

@Component({
  selector: 'app-cognitive-category-admin-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    FormErrorLabelComponent,
    AutoCompleteModule,
  ],
  templateUrl: './cognitive-category-admin-modal.component.html',
})
export class CognitiveCategoryAdminModalComponent implements OnInit {
  // Inputs
  tests = input<TestsResponse>();

  // Signals
  dialog = signal(false);
  submitted = signal(false);
  globalError = signal('');
  cognitiveCategory = signal<CognitiveCategory | null>(null);
  testType = enumToOptions(TestType);

  testTypeOptions = Object.keys(TestType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: TestType[key as keyof typeof TestType],
    }));
  // Servicios inyectados
  private fb = inject(FormBuilder);
  cognitiveCategoryService = inject(CognitiveCategoryService);
  formErrorService = inject(FormErrorService);
  private notificationService = inject(NotificationService);

  // Eventos
  @Output() refreshTrigger = new EventEmitter<boolean>();

  // Variables de ayuda / estado
  filteredOptions: OptionData[] = [];
  previousOptions: any[] | null = null;

  // Computed / getters
  get currentCognitiveCategory() {
    return this.cognitiveCategory();
  }
  get isNew() {
    return (
      !this.currentCognitiveCategory ||
      this.currentCognitiveCategory.id === 'new'
    );
  }

  // Formulario
  cognitiveCategoryForm = this.fb.group({
    id: [''],
    testTypeId: [0, [Validators.required, Validators.min(0)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    code: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(250)]],
  });

  // Lifecycle
  ngOnInit() {
    this.globalError.set('');
  }

  // Métodos principales

  resetForm() {
    this.cognitiveCategoryForm.reset({});
    this.globalError.set('');
  }

  async loadCognitiveCategory(id: string) {
    try {
      const CognitiveCategory = await firstValueFrom(
        this.cognitiveCategoryService.getById(id)
      );
      this.cognitiveCategory.set(CognitiveCategory);
      this.cognitiveCategoryForm.patchValue(CognitiveCategory);
    } catch (error) {
      this.notificationService.error('Failed to load CognitiveCategory data');
    }
  }

  openModal(CognitiveCategory?: CognitiveCategory) {
    if (CognitiveCategory) {
      this.loadCognitiveCategory(CognitiveCategory.id);
    } else {
      this.cognitiveCategory.set(null);
      this.resetForm();
    }
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }

  async onSubmit() {
    const formValue = this.cognitiveCategoryForm.value;
    const valueLike: Partial<CognitiveCategory> = { ...(formValue as any) };
    const current = this.cognitiveCategory();
    const isNew = !current || current.id === 'new';

    const task = () =>
      isNew
        ? firstValueFrom(this.cognitiveCategoryService.create(valueLike))
        : firstValueFrom(
            this.cognitiveCategoryService.update(current!.id, valueLike)
          );

    const result = await submitForm(
      this.cognitiveCategoryForm,
      task,
      this.notificationService,
      'Cognitive Category saved successfully',
      'Failed to save Cognitive Category',
      this.formErrorService,
      (msg) => this.globalError.set(msg)
    );

    if (result) {
      this.closeModal();
      this.resetForm();
      this.refreshTrigger.emit(true);
    }
  }
}
