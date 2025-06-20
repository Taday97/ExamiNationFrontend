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
import { DeleteConfirmDialogComponent } from '@admin-dashboard/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { AdminTestModalComponent } from '../../components/admin-test-modal/admin-test-modal.component';
import { MessageService } from 'primeng/api';
import { NotificationService } from '@shared/services/notification.service';
import { CognitiveCategoryService } from '@admin-dashboard/services/cognitive-category.service';

@Component({
  selector: 'app-cognitive-category-admin-page',
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
  templateUrl: './cognitive-category-admin-page.component.html',
  providers: [MessageService, NotificationService],
})
export class CognitiveCategoryAdminPageComponent {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(AdminTestModalComponent)
  modal!: AdminTestModalComponent;

  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'testTypeId', label: 'Test Type' },
  ];
  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('name');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  TestType = TestType;
  baseColors = [
    '#4DA3FF',
    '#B266FF',
    '#7B61FF',
    '#FF7F2A',
    '#56CC9D',
    '#FF6B81',
    '#FFD93D',
    '#00C1D4',
    '#FFA69E',
    '#845EC2',
  ];
  getRandomColor(index: number): string {
    return this.baseColors[index % this.baseColors.length];
  }

  cognitiveCategoryService = inject(CognitiveCategoryService);

  categoriesResource = rxResource({
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
      return this.cognitiveCategoryService.getPage(request).pipe(
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
