import { Question } from '@shared/interfaces/question.interface';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { QuestionType } from '@shared/interfaces/question.interface';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { handle } from 'src/app/utils/handle.helper';
import { ImageUrl } from '@shared/interfaces/ImageUrl';
import { TestsResponse } from '@shared/interfaces/test.interface';
import { DropdownModule } from 'primeng/dropdown';
import { OptionResponse } from '@shared/interfaces/option.interface';
import { OptionData } from '../../../../shared/interfaces/option.interface';
import {
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { enumToOptions } from 'src/app/utils/enum-utils';
import { atLeastOneCorrectOptionValidator } from 'src/app/utils/validators/atLeastOneCorrectOptionValidator';
import { QuestionsService } from '@shared/services/questions.service';
import { CognitiveCategoriesResponse } from '@shared/interfaces/cognitve-category';

@Component({
  selector: 'app-question-admin-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    FormErrorLabelComponent,
    AutoCompleteModule,
  ],
  templateUrl: './question-admin-modal.component.html',
})
export class QuestionAdminModalComponent implements OnInit {
  // Inputs
  tests = input<TestsResponse>();
  cognitiveCategories = input<CognitiveCategoriesResponse>();

  // Signals
  newOptions = signal<OptionData[]>([]);
  dialog = signal(false);
  submitted = signal(false);
  globalError = signal('');
  question = signal<Question | null>(null);

  // Servicios inyectados
  private fb = inject(FormBuilder);
  questionService = inject(QuestionsService);
  questionsService = inject(QuestionsService);
  private notificationService = inject(NotificationService);

  // Eventos
  @Output() refreshTrigger = new EventEmitter<boolean>();

  // Variables de ayuda / estado
  filteredOptions: OptionData[] = [];
  previousOptions: any[] | null = null;

  // Computed / getters
  get currentQuestion() {
    return this.question();
  }
  get isNew() {
    return !this.currentQuestion || this.currentQuestion.id === 'new';
  }
  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }
  get isTrueFalse() {
    return this.questionForm.get('type')?.value === QuestionType.TrueFalse;
  }
  questionsTypes = enumToOptions(QuestionType);

  questionTypeOptions = Object.keys(QuestionType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: QuestionType[key as keyof typeof QuestionType],
    }));

  // Formulario
  questionForm = this.fb.group({
    id: [''],
    text: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
    type: [0, Validators.required],
    testId: ['', Validators.required],
    cognitiveCategoryId: [''],
    questionNumber: [0, [Validators.required, Validators.min(1)]],
    score: [0, [Validators.required, Validators.min(0)]],
    selectedOptionId: [''],
    options: this.fb.array([], atLeastOneCorrectOptionValidator()),
  });

  // Lifecycle
  ngOnInit() {
    this.globalError.set('');
  }

  // Métodos principales

  resetForm() {
    this.questionForm.reset({});
    this.globalError.set('');
  }

  async loadQuestion(id: string) {
    try {
      const question = await firstValueFrom(this.questionsService.getById(id));
      this.question.set(question);

      this.options.clear();
      question.options.forEach((opt) => {
        this.options.push(
          this.fb.group({
            id: [opt.id],
            text: [opt.text, Validators.required],
            isCorrect: [opt.isCorrect ?? false],
            questionId: [opt.questionId],
            questionText: [opt.questionText],
          })
        );
      });

      const safeQuestion = {
        ...question,
        options: question.options.map((opt) => ({
          ...opt,
          isCorrect: opt.isCorrect ?? false,
        })),
      };

      this.questionForm.patchValue(safeQuestion);
    } catch (error) {
      this.notificationService.error('Failed to load question data');
    }
  }

  openModal(question?: Question) {
    if (question) {
      this.loadQuestion(question.id);
    } else {
      this.question.set(null);
      this.resetForm();
      this.options.clear();
      this.addOption('');
    }
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }

  async onSubmit() {
    this.questionForm.markAllAsTouched();
    this.options.controls.forEach((control) => {
      control.get('text')?.markAsTouched();
    });
    if (!this.questionForm.valid) return;

    const formValue = this.questionForm.value;
    const questionLike: Partial<Question> = { ...(formValue as any) };

    const currentQuestion = this.question();
    const isNew = !currentQuestion || currentQuestion.id === 'new';

    const task = () => {
      if (isNew) {
        return firstValueFrom(this.questionsService.create(questionLike));
      } else {
        return firstValueFrom(
          this.questionsService.update(currentQuestion!.id, questionLike)
        );
      }
    };

    const response = await handle(
      task,
      'Question saved successfully',
      this.notificationService,
      'Failed to save question',
      { suppressNotifications: true }
    );

    if (response?.result) {
      this.notificationService.success('Question saved successfully');
      this.closeModal();
      this.resetForm();
      this.refreshTrigger.emit(true);
    } else if (response?.validationErrors) {
      this.setBackendErrors(response.validationErrors);
    } else if (response?.message) {
      this.globalError.set(response.message);
    } else {
      this.notificationService.error('Failed to save question');
    }
  }

  setBackendErrors(errors?: { [key: string]: string[] }) {
    errors = errors ?? {};
    this.globalError.set('');

    Object.entries(errors).forEach(([fieldName, messages]) => {
      const control = this.questionForm.get(fieldName);
      if (control) {
        control.setErrors({ backend: messages.join(', ') });
      } else if (fieldName.startsWith('options[')) {
        const match = fieldName.match(/^options\[(\d+)]\.(\w+)$/);
        if (match) {
          const index = +match[1];
          const subField = match[2];
          const optionControl = this.options.at(index).get(subField);
          if (optionControl) {
            optionControl.setErrors({ backend: messages.join(', ') });
          }
        }
      } else {
        this.globalError.set(
          (this.globalError() + '\n' + messages.join(', ')).trim()
        );
      }
    });
  }

  // Manejo de tipo de pregunta y opciones

  onQuestionTypeSelected(typeId: number) {
    if (typeId === null || typeId === undefined) return;

    if (typeId === QuestionType.TrueFalse && !this.previousOptions) {
      this.previousOptions = this.questionForm.get('options')?.value ?? [];
    }

    if (typeId !== QuestionType.TrueFalse && this.previousOptions) {
      this.options.clear();
      this.previousOptions.forEach((opt) => {
        this.options.push(
          this.fb.group({
            id: [opt.id],
            text: [opt.text, Validators.required],
            isCorrect: [opt.isCorrect],
            questionId: [opt.questionId],
            questionText: [opt.questionText],
          })
        );
      });
      this.previousOptions = null;
      this.globalError.set('');
    }

    this.questionForm.get('type')?.setValue(typeId);

    if (typeId === QuestionType.TrueFalse) {
      this.options.clear();
      this.addOption('True');
      this.addOption('False');
    } else if (typeId === QuestionType.SingleChoice) {
      this.options.controls.forEach((control) => {
        control.get('isCorrect')?.setValue(false);
      });
      this.questionForm.get('selectedOptionId')?.setValue(null);
    }
  }

  onTestSelected(testId: string) {
    if (!testId) return;

    this.questionService.getNextQuestionNumber(testId).subscribe({
      next: (nextNumber) => {
        this.questionForm.get('questionNumber')?.setValue(nextNumber);
      },
      error: (err) => {
        console.error('Error obteniendo número sugerido:', err);
      },
    });
  }

  // Opciones

  addOption(text: string = '') {
    if (this.question()) {
      this.options.push(
        this.fb.group({
          id: [null],
          text: [text, Validators.required],
          isCorrect: [false],
          questionId: [this.question()?.id],
          questionText: [this.question()?.text],
        })
      );
    } else {
      this.options.push(
        this.fb.group({
          id: [''],
          text: [text, Validators.required],
          isCorrect: [false],
          questionId: [null],
        })
      );
    }
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  onOptionBlur(index: number) {
    const text = this.options.at(index).get('text')?.value?.trim();
    if (text) {
      this.newOptions.update((options) => {
        const exists = options.some(
          (option) => option.text.toLowerCase() === text.toLowerCase()
        );
        if (!exists) {
          const newOption: OptionData = {
            id: '',
            text,
            isCorrect: false,
            questionId: null,
            questionText: null,
          };
          return [...options, newOption];
        }
        return options;
      });
    }
  }

  selectOption(optionId: string) {
    this.questionForm.get('selectedOptionId')?.setValue(optionId);

    const isSingle =
      this.questionForm.get('type')?.value === QuestionType.SingleChoice ||
      this.questionForm.get('type')?.value === QuestionType.TrueFalse;
    if (isSingle) {
      this.options.controls.forEach((control) => {
        control.get('isCorrect')?.setValue(control.value.id === optionId);
      });
    }
  }

  toggleOption(index: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const type = this.questionForm.get('type')?.value;

    if (type === QuestionType.SingleChoice || type === QuestionType.TrueFalse) {
      this.options.controls.forEach((control, i) => {
        control.get('isCorrect')?.setValue(i === index ? checked : false);
      });

      if (checked) {
        const selectedId = this.options.at(index).get('id')?.value;
        this.questionForm.get('selectedOptionId')?.setValue(selectedId);
      } else {
        this.questionForm.get('selectedOptionId')?.setValue(null);
      }
    } else if (type === QuestionType.MultipleChoice) {
      this.options.at(index).get('isCorrect')?.setValue(checked);
    }
  }
}
