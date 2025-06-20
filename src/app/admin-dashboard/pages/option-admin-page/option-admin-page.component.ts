import { Component } from '@angular/core';
import { computed, inject, signal, ViewChild } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { TestsService } from '@shared/services/tests.service';
import { CommonModule } from '@angular/common';
import { Test, TestType } from '@shared/interfaces/test.interface';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DeleteConfirmDialogComponent } from '@admin-dashboard/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { AdminTestModalComponent } from '../../components/admin-test-modal/admin-test-modal.component';
import { OptionsService } from '@admin-dashboard/services/options.service';
import { MessageService } from 'primeng/api';
import { NotificationService } from '@shared/services/notification.service';
import { Question } from '@shared/interfaces/question.interface';

@Component({
  selector: 'app-option-admin-page',
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
    AdminTestModalComponent,
  ],
  templateUrl: './option-admin-page.component.html',
  providers: [MessageService, NotificationService],
})
export class OptionAdminPageComponent {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(AdminTestModalComponent)
  modal!: AdminTestModalComponent;

  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  columns = [
    { key: 'text', label: 'Text' },
    { key: 'questionText', label: 'Question' },
    { key: 'isCorrect', label: 'Correct' },
  ];
  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('text');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  optionsService = inject(OptionsService);

  optionsResource = rxResource({
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
      return this.optionsService.getPage(request).pipe(
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
