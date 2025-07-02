import { Question } from '@shared/interfaces/question.interface';
import {
  Component,
  EventEmitter,
  inject,
  input,
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
import { QuestionsService } from '@shared/services/questions.service';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { handle } from 'src/app/utils/handle.helper';
import { ImageUrl } from '@shared/interfaces/ImageUrl';
import { TestsResponse } from '@shared/interfaces/test.interface';
import { CognitiveCategoryResponse } from '@shared/interfaces/cognitve-category';
import { DropdownModule } from 'primeng/dropdown';
import { OptionResponse } from '@shared/interfaces/option.interface';
import { OptionData } from '../../../../shared/interfaces/option.interface';
import {
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { enumToOptions } from 'src/app/utils/enum-utils';

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
export class QuestionAdminModalComponent {
  constructor(private notificationService: NotificationService) {}

  tests = input<TestsResponse>();
  cognitiveCategories = input<CognitiveCategoryResponse>();
  newOptions = signal<OptionData[]>([]);
  questionsTypes = enumToOptions(QuestionType);

  @Output() refreshTrigger = new EventEmitter<boolean>();

  filteredOptions: OptionData[] = [];
  questionService = inject(QuestionsService);

  dialog = signal(false);
  submitted = signal(false);

  private fb = inject(FormBuilder);
  questionsService = inject(QuestionsService);

  question = signal<Question | null>(null);
  currentQuestion = this.question();
  isNew = !this.currentQuestion || this.currentQuestion.id === 'new';

  questionTypeOptions = Object.keys(QuestionType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: QuestionType[key as keyof typeof QuestionType],
    }));

  questionForm = this.fb.group({
    id: [''],
    text: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(500)],
    ],
    type: [0, Validators.required],
    testId: ['', Validators.required],
    cognitiveCategoryId: [''],
    questionNumber: [0, [Validators.required, Validators.min(1)]],
    score: [0, [Validators.required, Validators.min(0)]],
    selectedOptionId: [''],
    options: this.fb.array([
      this.fb.group({
        id: [''],
        text: ['', Validators.required],
        isCorrect: [false], // default valor
      }),
    ]),
  });

  resetForm() {
    this.questionForm.reset({});
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
  onQuestionTypeSelected(typeId: number) {
    if (typeId === null || typeId === undefined) return;

    this.questionForm.get('type')?.setValue(typeId);
    if (typeId === QuestionType.TrueFalse) {
      const optionsFormArray = this.options;
      optionsFormArray.clear();
      const options = [
        {
          id: '',
          text: 'True',
          isCorrect: false,
          questionId: null,
          questionText: null,
        },
        {
          id: '',
          text: 'False',
          isCorrect: false,
          questionId: null,
          questionText: null,
        },
      ];
    }
  }

  async loadQuestion(id: string) {
    try {
      const question = await firstValueFrom(this.questionsService.getById(id));
      this.question.set(question);
      const optionsFormArray = this.options;
      optionsFormArray.clear();
      question.options.forEach((opt) => {
        optionsFormArray.push(
          this.fb.group({
            id: [opt.id],
            text: [opt.text, Validators.required],
            isCorrect: [opt.isCorrect],
            questionId: [opt.questionId],
            questionText: [opt.questionText],
          })
        );
      });
      this.questionForm.patchValue(question);
    } catch (error) {
      this.notificationService.error('Failed to load question data');
    }
  }
  openModal(question?: Question) {
    if (question) {
      this.loadQuestion(question!.id);
    } else {
      this.question.set(null);
      this.resetForm();
    }
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }

  async onSubmit() {
    console.log('sdfrgger');
    this.questionForm.markAllAsTouched();
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

    await handle(
      task,
      'Question saved successfully',
      this.notificationService,
      'Failed to save question'
    );

    this.closeModal();
    this.resetForm();
    this.refreshTrigger.emit();
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    if (this.question()) {
      this.options.push(
        this.fb.group({
          id: [null],
          text: ['', Validators.required],
          isCorrect: [false],
          questionId: [this.question()?.id],
          questionText: [this.question()?.text],
        })
      );
    } else {
      this.options.push(
        this.fb.group({
          id: [''],
          text: ['', Validators.required],
          isCorrect: [false],
          questionId: [''],
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
      // Solo permite una opción correcta: desmarca todas y marca la seleccionada
      this.options.controls.forEach((control, i) => {
        control.get('isCorrect')?.setValue(i === index ? checked : false);
      });

      // Si tienes selectedOptionId para mostrar opción seleccionada
      if (checked) {
        const selectedId = this.options.at(index).get('id')?.value;
        this.questionForm.get('selectedOptionId')?.setValue(selectedId);
      } else {
        this.questionForm.get('selectedOptionId')?.setValue(null);
      }
    } else if (type === QuestionType.MultipleChoice) {
      // Para MultipleChoice puedes marcar/desmarcar libremente
      this.options.at(index).get('isCorrect')?.setValue(checked);
    }
  }
}
