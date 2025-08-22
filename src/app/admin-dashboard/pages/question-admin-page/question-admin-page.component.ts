import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { TestsService } from '@admin-dashboard/services/tests.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import {
  Test,
  TestsResponse,
  TestType,
} from '@shared/interfaces/test.interface';
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
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { NotificationService } from '@shared/services/notification.service';
import { DeleteConfirmDialogComponent } from '@admin-dashboard/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { QuestionAdminModalComponent } from './question-admin-modal/question-admin-modal.component';
import { Question, QuestionType } from '@shared/interfaces/question.interface';
import { FormUtils } from 'src/app/utils/form-utils';

import { CamelCaseToSpacesPipe } from '../../../shared/pipes/camelCaseToSpaces.pipe';
import { CognitiveCategoryService } from '@admin-dashboard/services/cognitive-category.service';
import { enumToOptions } from 'src/app/utils/enum-utils';
import { OptionService } from '@admin-dashboard/services/options.service';
import { OptionResponse } from '@shared/interfaces/option.interface';
import { QuestionsService } from '@shared/services/questions.service';
import { CognitiveCategoriesResponse } from '@shared/interfaces/cognitve-category';
import { toDropdownOptions } from 'src/app/utils/toDropdownOptions';

@Component({
  selector: 'app-admin-questions-table',
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    CommonModule,
    FormsModule,
    CommonModule,
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
    ToastModule,
    DeleteConfirmDialogComponent,
    CamelCaseToSpacesPipe,
    QuestionAdminModalComponent,
  ],
  templateUrl: './question-admin-page.component.html',
  providers: [MessageService, NotificationService],
})
export class QuestionAdminPageComponent implements OnInit {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(QuestionAdminModalComponent)
  modal!: QuestionAdminModalComponent;

  private fb = inject(FormBuilder);

  // columns = [
  //   { key: 'name', label: 'Test Name', filterType: 'text' },
  //   { key: 'description', label: 'Description', filterType: 'text' },
  //   {
  //     key: 'type',
  //     label: 'Type',
  //     filterType: 'dropdown',
  //     options: this.testTypeOptions,
  //   },
  //   { key: 'createdAt', label: 'Created Date', filterType: 'date' },
  // ];
  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);
  QuestionType = QuestionType;

  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('questionNumber');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  dialog = signal(false);
  question = signal<Question | null>(null);
  currentTest = this.question();
  isNew = !this.currentTest || this.currentTest.id === 'new';

  questionForm = this.fb.group({
    id: [''],
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    description: ['', [Validators.maxLength(500)]],
    imageUrl: ['', [FormUtils.imageValidator]],
  });

  resetForm() {
    this.questionForm.reset({
      id: '',
      name: '',
      description: '',
      imageUrl: '',
    });
  }

  questionService = inject(QuestionsService);
  testsService = inject(TestsService);
  categoriesService = inject(CognitiveCategoryService);
  optionsService = inject(OptionService);

  tests = signal<TestsResponse | null>(null);
  cognitiveCategories = signal<CognitiveCategoriesResponse | null>(null);
  testOptions = signal<{ label: string; value: any }[]>([]);
  categoryOptions = signal<{ label: string; value: any }[]>([]);
  questionTypeOptions = [
    ...enumToOptions(QuestionType),
  ];
  columns = [
    { key: 'questionNumber', label: 'Nº', filterType: 'text' },
    { key: 'text', label: 'Question', filterType: 'text' },
    {
      key: 'type',
      label: 'Type',
      filterType: 'dropdown',
      options: this.questionTypeOptions,
    },
    { key: 'testId', label: 'Test', filterType: 'dropdown', options: [] },
    {
      key: 'cognitiveCategoryId',
      label: 'Category',
      filterType: 'dropdown',
      options: [],
    },
    { key: 'score', label: 'Score', filterType: 'numeric' },
  ];

  ngOnInit() {
    this.testsService.getAll().subscribe((t) => {
      this.tests.set(t);
      const options = toDropdownOptions(t.data, 'name', 'id');
      this.testOptions.set(options);
      this.columns.find((col) => col.key === 'testId')!.options = options;
    });

    this.categoriesService.getAll().subscribe((c) => {
      this.cognitiveCategories.set(c);
      const options = toDropdownOptions(c.data, 'name', 'id');
      this.categoryOptions.set(options);
      this.columns.find((col) => col.key === 'cognitiveCategoryId')!.options =
        options;
    });
  }

  questionsResource = rxResource({
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
      return this.questionService.getPage(request).pipe(
        map((res) => {
          this.loading.set(false);
          this.totalRecords = res.data.totalCount;
          console.log(res.data.items);
          return res.data.items;
        }),
        catchError((err) => {
          console.log(err);
          this.loading.set(false);
          return of([]);
        })
      );
    },
  });

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
    const activeFilters: { [key: string]: string } = {};

    for (const field in filters) {
      const filterItem = filters[field][0]?.value;

      if (filterItem !== undefined && filterItem !== null) {
        const value =
          typeof filterItem === 'object' && filterItem.value !== undefined
            ? filterItem.value
            : filterItem;

        activeFilters[field] = value.toString();
      }
    }

    this.filters.set(activeFilters);
  }

  onRefresh() {
    this.refreshTrigger.update((prev) => !prev);
  }

  openEditModal(question?: Question) {
    this.modal.openModal(question);
  }

  openDeleteModal(id: string) {
    this.deleteDialog.openModal(id);
  }

  cancelDeleteModal() {
    this.deleteDialog.onCancel();
  }
}
