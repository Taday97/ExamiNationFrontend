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

@Component({
  selector: 'app-scoring-range-admin-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    FormErrorLabelComponent,
    AutoCompleteModule,
  ],
  templateUrl: './scoring-range-admin-modal.component.html',
})
export class ScoringRangeAdminModalComponent implements OnInit {
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
      this.notificationService.error('Failed to load scoreRange data');
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
    this.scoreRangeForm.markAllAsTouched();
    console.log('valida');
    if (!this.scoreRangeForm.valid) return;

    const formValue = this.scoreRangeForm.value;
    const scoreRangeLike: Partial<ScoreRange> = { ...(formValue as any) };

    const currentscoreRange = this.scoreRange();
    const isNew = !currentscoreRange || currentscoreRange.id === 'new';

    const task = () => {
      if (isNew) {
        return firstValueFrom(this.scoreRangeService.create(scoreRangeLike));
      } else {
        return firstValueFrom(
          this.scoreRangeService.update(currentscoreRange!.id, scoreRangeLike)
        );
      }
    };

    const response = await handle(
      task,
      'Score Range saved successfully',
      this.notificationService,
      'Failed to save Score Range',
      { suppressNotifications: true }
    );

    if (response?.result) {
      this.notificationService.success('ScoreRange saved successfully');
      this.closeModal();
      this.resetForm();
      this.refreshTrigger.emit(true);
    } else if (response?.validationErrors) {
      this.setBackendErrors(response.validationErrors);
    } else if (response?.message) {
      this.globalError.set(response.message);
    } else {
      this.notificationService.error('Failed to save scoreRange');
    }
  }

  setBackendErrors(errors?: { [key: string]: string[] }) {
    errors = errors ?? {};
    this.globalError.set('');

    Object.entries(errors).forEach(([fieldName, messages]) => {
      const control = this.scoreRangeForm.get(fieldName);
      if (control) {
        control.setErrors({ backend: messages.join(', ') });
      } else {
        this.globalError.set(
          (this.globalError() + '\n' + messages.join(', ')).trim()
        );
      }
    });
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
