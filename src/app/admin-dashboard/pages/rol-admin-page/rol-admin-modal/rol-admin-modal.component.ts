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
import { handle } from 'src/app/utils/handle.helper';
import { TestsResponse } from '@shared/interfaces/test.interface';
import { DropdownModule } from 'primeng/dropdown';
import { OptionData } from '@shared/interfaces/option.interface';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { minLessThanOrEqualMaxValidator } from 'src/app/utils/validators/minLessThanOrEqualMaxValidator';
import { ScoreRange } from '@shared/interfaces/score-ranges';
import { ScoreRangesService } from '@admin-dashboard/services/score-ranges.service';
import { FormErrorService } from '@shared/services/form-error.service';
import { submitForm } from 'src/app/utils/submit-form.helper';

@Component({
  selector: 'app-rol-admin-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    AutoCompleteModule,
  ],
  templateUrl: './rol-admin-modal.component.html',
})
export class RolAdminModalComponent implements OnInit {
  // Inputs
  tests = input<TestsResponse>();

  // Signals
  dialog = signal(false);
  submitted = signal(false);
  globalError = signal('');
  scoreRange = signal<ScoreRange | null>(null);

  // Servicios inyectados
  private fb = inject(FormBuilder);
  scoreRangeService = inject(ScoreRangesService);
  formErrorService = inject(FormErrorService);
  private notificationService = inject(NotificationService);

  // Eventos
  @Output() refreshTrigger = new EventEmitter<boolean>();

  // Variables de ayuda / estado
  filteredOptions: OptionData[] = [];
  previousOptions: any[] | null = null;

  // Computed / getters
  get currentscoreRange() {
    return this.scoreRange();
  }
  get isNew() {
    return !this.currentscoreRange || this.currentscoreRange.id === 'new';
  }

  // Formulario
  scoreRangeForm = this.fb.group(
    {
      id: [''],
      testId: ['', Validators.required],
      minScore: [0, Validators.required],
      maxScore: [0, Validators.required],
      classification: ['', [Validators.required, Validators.maxLength(100)]],
      shortDescription: ['', Validators.required],
      detailedExplanation: ['', Validators.required],
      recommendations: ['', Validators.required],
    },
    { validators: minLessThanOrEqualMaxValidator }
  );

  // Lifecycle
  ngOnInit() {
    this.globalError.set('');
  }

  // Métodos principales

  resetForm() {
    this.scoreRangeForm.reset({});
    this.globalError.set('');
  }

  async loadscoreRange(id: string) {
    try {
      const scoreRange = await firstValueFrom(
        this.scoreRangeService.getById(id)
      );
      this.scoreRange.set(scoreRange);
      this.scoreRangeForm.patchValue(scoreRange);
    } catch (error) {
      this.notificationService.error('Failed to load Score Range data');
    }
  }

  openModal(scoreRange?: ScoreRange) {
    if (scoreRange) {
      this.loadscoreRange(scoreRange.id);
    } else {
      this.scoreRange.set(null);
      this.resetForm();
    }
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }

  async onSubmit() {
    const formValue = this.scoreRangeForm.value;
    const valueLike: Partial<ScoreRange> = { ...(formValue as any) };
    const current = this.scoreRange();
    const isNew = !current || current.id === 'new';

    const task = () =>
      isNew
        ? firstValueFrom(this.scoreRangeService.create(valueLike))
        : firstValueFrom(this.scoreRangeService.update(current!.id, valueLike));

    console.log('submitForm');
    const result = await submitForm(
      this.scoreRangeForm,
      task,
      this.notificationService,
      'Rol saved successfully',
      'Failed to save Rol',
      this.formErrorService,
      (msg) => this.globalError.set(msg)
    );

    if (result) {
      this.closeModal();
      this.resetForm();
      this.refreshTrigger.emit(true);
    }
  }
  onTestSelected(testId: string) {
    if (!testId) return;

    this.scoreRangeService.getNextMinScore(testId).subscribe({
      next: (nextNumber) => {
        this.scoreRangeForm.get('minScore')?.setValue(nextNumber);
      },
      error: (err) => {
        console.error('Error obteniendo número sugerido:', err);
      },
    });
  }
}
