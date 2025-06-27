import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Test, TestType } from '@shared/interfaces/test.interface';

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
import { NotificationService } from '@shared/services/notification.service';
import { DeleteConfirmDialogComponent } from '@admin-dashboard/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { Question, QuestionType } from '@shared/interfaces/question.interface';
import { QuestionsService } from '@shared/services/questions.service';
import { CamelCaseToSpacesPipe } from "@shared/pipes/camelCaseToSpaces.pipe";
import { TestAdminModalComponent } from '../test-admin-page/test-admin-modal/test-admin-modal.component';

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
    TestAdminModalComponent
],
  templateUrl: './question-admin-page.component.html',
  providers: [MessageService, NotificationService],
})
export class QuestionAdminPageComponent {

  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(TestAdminModalComponent)
  modal!: TestAdminModalComponent;

  columns = [
    { key: 'questionNumber', label: 'Nº' },
    { key: 'text', label: 'Question' },
    { key: 'type', label: 'Type' },
    { key: 'testName', label: 'Test' },
    { key: 'cognitiveCategoryName', label: 'Category' },
    { key: 'score', label: 'Score' },
  ];
  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('questionNumber');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  QuestionType = QuestionType;
  questionService = inject(QuestionsService);

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
    this.isFiltering.set(
      Object.values(filters).some(
        (f: any) => f?.value?.toString().trim() !== ''
      )
    );
  }

  onRefresh() {
    this.refreshTrigger.update((prev) => !prev);
  }

  openEditModal(test?: Test) {
    this.modal.openModal(test);
  }

  openDeleteModal(id: string) {
    this.deleteDialog.openModal(id);
  }

  cancelDeleteModal() {
    this.deleteDialog.onCancel();
  }
}
