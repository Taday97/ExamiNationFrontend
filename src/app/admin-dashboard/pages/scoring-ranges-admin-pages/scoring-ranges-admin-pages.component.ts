import { Component, OnInit } from '@angular/core';
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
import { ScoreRangesService } from '@admin-dashboard/services/score-ranges.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { QuestionAdminModalComponent } from '../question-admin-page/question-admin-modal/question-admin-modal.component';
import { ScoringRangeAdminModalComponent } from './scoring-range-admin-modal/scoring-range-admin-modal.component';
import { ScoreRange } from '@shared/interfaces/score-ranges';
import { TestsService } from '@admin-dashboard/services/tests.service';

@Component({
  selector: 'app-scoring-ranges-admin-pages',
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
    ScoringRangeAdminModalComponent,
  ],
  templateUrl: './scoring-ranges-admin-pages.component.html',
  providers: [MessageService, NotificationService],
})
export class ScoringRangesAdminPagesComponent implements OnInit {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(ScoringRangeAdminModalComponent)
  modal!: ScoringRangeAdminModalComponent;

  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  columns = [
    { key: 'testName', label: 'Test Name' },
    { key: 'minScore', label: 'Score Range' },
    { key: 'classification', label: 'Classification' },
    { key: 'shortDescription', label: 'Short Description' },
  ];
  keys = this.columns.map((col) => col.key);
  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('name');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  testUiService = inject(TestUiService);
  testsService = inject(TestsService);
  scoreRangesService = inject(ScoreRangesService);
  tests = signal<TestsResponse | null>(null);

  ngOnInit() {
    this.testsService.getAll().subscribe((t) => this.tests.set(t));
  }
  scoringrangesResource = rxResource({
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
      console.log('Filters:', request.filters);
      return this.scoreRangesService.getPage(request).pipe(
        map((res) => {
          this.loading.set(false);
          this.totalRecords = res.data.totalCount;
          console.log(res.data.items);
          const enrichedItems = res.data.items.map((item, index) => ({
            ...item,
            testTypeData: this.testUiService.getTestTypeData(item.testType),
            randomColor: this.testUiService.getRandomColor(index),
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

  loadScoringRangesLazy(event: any) {
    this.pageNumber.set(event.first / event.rows + 1);
    this.sortField.set(event.sortField || 'name');
    this.sortDescending.set(event.sortOrder !== 1);
    const updatedFilters: { [key: string]: string } = {};
    for (const key in event.filters) {
      const filterValue = event.filters[key]?.[0].value;
      if (filterValue) {
        updatedFilters[key] = filterValue;
      }
    }
    console.log('Setting filters:', updatedFilters);
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

  openEditModal(scoreRange?: ScoreRange) {
    this.modal.openModal(scoreRange);
  }

  openDeleteModal(id: string) {
    this.deleteDialog.openModal(id);
  }

  cancelDeleteModal() {
    this.deleteDialog.onCancel();
  }
}
