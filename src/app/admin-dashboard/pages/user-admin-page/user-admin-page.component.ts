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
import { UsersService } from '@admin-dashboard/services/users.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { QuestionAdminModalComponent } from '../question-admin-page/question-admin-modal/question-admin-modal.component';
import { User } from '@shared/interfaces/users.interface';
import { TestsService } from '@admin-dashboard/services/tests.service';
import { toDropdownOptions } from 'src/app/utils/toDropdownOptions';
import { UserAdminModalComponent } from './user-admin-modal/user-admin-modal.component';
import { RolesService } from '@admin-dashboard/services/roles.service';
import { RolesResponse } from '@shared/interfaces/roles.interface';

@Component({
  selector: 'app-user-admin-page',
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
    UserAdminModalComponent
],
  templateUrl: './user-admin-page.component.html',
  providers: [MessageService, NotificationService],
})
export class UserAdminPageComponent implements OnInit {
  @ViewChild(DeleteConfirmDialogComponent)
  deleteDialog!: DeleteConfirmDialogComponent;
  @ViewChild(UserAdminModalComponent)
  modal!: UserAdminModalComponent;

  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('testName');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  testUiService = inject(TestUiService);
  rolesService = inject(RolesService);
  UsersService = inject(UsersService);
  roles = signal<RolesResponse | null>(null);
  rolesOptions = signal<{ label: string; value: any }[]>([]);
  emailConfirmed = [
    { label: 'Confirmed', value: true },
    { label: 'Not Confirmed', value: false },
  ];
  columns = [
    { key: 'userName', label: 'User', filterType: 'text' },
    {
      key: 'roles',
      label: 'Roles',
      filterType: 'dropdown',
      options: this.rolesOptions(),
    },
    { key: 'emailConfirmed', label: 'Email Confirmed',  filterType: 'dropdown', options: this.emailConfirmed },

  ];
  ngOnInit() {
    this.rolesService.getAll().subscribe((t) => {
      this.roles.set(t);
      const options = toDropdownOptions(t.data, 'name', 'id');
      this.rolesOptions.set(options);
      this.columns.find((col) => col.key === 'roles')!.options = options;
    });
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
      return this.UsersService.getPage(request).pipe(
        map((res) => {
          this.loading.set(false);
          this.totalRecords = res.data.totalCount;
          console.log(res.data.items);
          const enrichedItems = res.data.items.map((item, index) => ({
            ...item,
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

  openEditModal(User?: User) {
    this.modal.openModal(User);
  }

  openDeleteModal(id: string) {
    this.deleteDialog.openModal(id);
  }

  cancelDeleteModal() {
    this.deleteDialog.onCancel();
  }
}
