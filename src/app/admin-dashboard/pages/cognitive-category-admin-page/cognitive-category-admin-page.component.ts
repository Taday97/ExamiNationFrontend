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
import { MessageService } from 'primeng/api';
import { NotificationService } from '@shared/services/notification.service';
import { CognitiveCategoryService } from '@admin-dashboard/services/cognitive-category.service';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { TestAdminModalComponent } from '../test-admin-page/test-admin-modal/test-admin-modal.component';
import { CognitiveCategoryAdminModalComponent } from './cognitive-category-admin-modal/cognitive-category-admin-modal.component';
import { CognitiveCategory } from '@shared/interfaces/cognitve-category';
import { enumToOptions } from 'src/app/utils/enum-utils';

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
    CognitiveCategoryAdminModalComponent,
  ],
  templateUrl: './cognitive-category-admin-page.component.html',
  providers: [MessageService, NotificationService],
})
export class CognitiveCategoryAdminPageComponent {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(CognitiveCategoryAdminModalComponent)
  modal!: CognitiveCategoryAdminModalComponent;

  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);
  testTypeOptions = [ ...enumToOptions(TestType)];
  columns = [
    { key: 'name', label: 'Name', filterType: 'text' },
    { key: 'code', label: 'Code', filterType: 'text' },
    { key: 'description', label: 'Description', filterType: 'text' },
    {
      key: 'testTypeId',
      label: 'Test Type',
      filterType: 'dropdown',
      options: this.testTypeOptions,
    },
  ];
  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('name');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  TestType = TestType;

  testUiService = inject(TestUiService);
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
          const items = res.data.items.map((item) => ({
            ...item,
            testTypeData: this.testUiService.getTestTypeData(item.testTypeId),
            testTypeName: TestType[item.testTypeId],
          }));
          return items;
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

  openEditModal(cognitiveCategory?: CognitiveCategory) {
    this.modal.openModal(cognitiveCategory);
  }

  openDeleteModal(id: string) {
    this.deleteDialog.openModal(id);
  }

  cancelDeleteModal() {
    this.deleteDialog.onCancel();
  }
}
