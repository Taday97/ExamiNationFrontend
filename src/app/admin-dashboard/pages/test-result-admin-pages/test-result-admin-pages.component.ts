import { Component } from '@angular/core';
import { computed, inject, signal, ViewChild } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Test,
  TestsResponse,
  TestType,
} from '@shared/interfaces/test.interface';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DeleteConfirmDialogComponent } from '@admin-dashboard/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { MessageService } from 'primeng/api';
import { NotificationService } from '@shared/services/notification.service';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { TestResultService } from '@admin-dashboard/services/testResult.service';
import {
  TestResultHistory,
  TestResultStatus,
} from '@test/interfaces/test-result.interface';
import { CamelCaseToSpacesPipe } from '../../../shared/pipes/camelCaseToSpaces.pipe';
import { TestResultModalComponent } from '@admin-dashboard/pages/test-result-admin-pages/test-result-modal/test-result-modal.component';
import { TestsService } from '@admin-dashboard/services/tests.service';
import { toDropdownOptions } from 'src/app/utils/toDropdownOptions';
import { enumToOptions } from 'src/app/utils/enum-utils';

@Component({
  selector: 'app-test-result-admin-pages',
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
    TestResultModalComponent,
  ],
  templateUrl: './test-result-admin-pages.component.html',
  providers: [MessageService, NotificationService],
})
export class TestResultAdminPagesComponent {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(TestResultModalComponent)
  modal!: TestResultModalComponent;
  showModal = signal(false);
  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  testsService = inject(TestsService);
  tests = signal<TestsResponse | null>(null);
  testOptions = signal<{ label: string; value: any }[]>([]);
  testResultStatus = [
    { label: 'All', value: '' },
    ...enumToOptions(TestResultStatus),
  ];
  columns = [
    { key: 'userEmail', label: 'User', filterType: 'text' },
    {
      key: 'testId',
      label: 'Test',
      filterType: 'dropdown',
      options: this.testOptions(),
    },
    { key: 'startedAt', label: 'Start', filterType: 'text' },
    { key: 'completedAt', label: 'End', filterType: 'text' },
    { key: 'score', label: 'Score', filterType: 'numeric' },
    { key: 'progressPercentage', label: 'Progress', filterType: 'text' },
    {
      key: 'status',
      label: 'State',
      filterType: 'dropdown',
      options: this.testResultStatus,
    },
  ];

  ngOnInit() {
    this.testsService.getAll().subscribe((t) => {
      this.tests.set(t);
      const options = toDropdownOptions(t.data, 'name', 'id');
      this.testOptions.set(options);
      this.columns.find((col) => col.key === 'testId')!.options = options;
    });
  }

  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('userEmail');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  testUiService = inject(TestUiService);
  testResultService = inject(TestResultService);

  testResulsResource = rxResource({
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
      return this.testResultService.getPage(request).pipe(
        map((res) => {
          this.loading.set(false);
          this.totalRecords = res.data.totalCount;
          console.log(res.data.items);
          const enrichedItems = res.data.items.map((item, index) => ({
            ...item,
            status: TestResultStatus[item.status],
            testTypeData: this.testUiService.getTestTypeData(item.testType),
            randomColor: this.testUiService.getRandomColor(
              Math.floor(Math.random() * this.testUiService.baseColors.length)
            ),
          }));

          return enrichedItems;
        }),
        catchError((err) => {
          this.loading.set(false);
          console.error(err);
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

  openEditModal(testResultHistory?: TestResultHistory) {
    console.log('Opening modal for:', testResultHistory);
    this.showModal.set(true);
    if (this.modal) {
      this.modal.openModal(testResultHistory);
    } else {
      console.error('Modal no inicializado todavía');
    }
  }

  openDeleteModal(id: string) {
    this.deleteDialog.openModal(id);
  }

  cancelDeleteModal() {
    this.deleteDialog.onCancel();
  }
}
