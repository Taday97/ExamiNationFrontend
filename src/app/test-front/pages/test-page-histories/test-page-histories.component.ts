import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/services/auth.service';
import { HistoryCardComponent } from '@test/components/history-card/history-card.component';
import { TestResultService } from '@admin-dashboard/services/testResult.service';
import { catchError, map, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { enumToOptions } from 'src/app/utils/enum-utils';
import { TestType } from '@shared/interfaces/test.interface';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { TestResultStatus } from '@test/interfaces/test-result.interface';

@Component({
  selector: 'app-test-page-histories',
  imports: [CommonModule, HistoryCardComponent, FormsModule, DropdownModule],
  templateUrl: './test-page-histories.component.html',
})
export class TestPageHistoriesComponent {
  pageSize = signal(10);
  pageNumber = signal(1);
  sortField = signal('startedAt');
  sortDescending = signal(true);
  filters = signal<{ [key: string]: string }>({});
  refreshTrigger = signal(false);

  testResultService = inject(TestResultService);
  testUiService = inject(TestUiService);
  authService = inject(AuthService);

  userId = computed(() => this.authService.user()?.id);

  testResultStatusOptions = [
    { label: 'All', value: '' },
    ...enumToOptions(TestResultStatus),
  ];
  constructor() {
    console.log('TestResultStatusOptions:', this.testResultStatusOptions);
  }
  filtersWithUserId = computed(() => ({
    ...this.filters(),
    userId: this.userId()!,
  }));
  selectedTestType: string = '';
  loading = signal(false);
  totalRecords = 0;

  testResulsResource = rxResource({
    request: computed(() => ({
      sortBy: this.sortField(),
      sortDescending: this.sortDescending(),
      filters: this.filtersWithUserId(),
      refresh: this.refreshTrigger(),
    })),
    loader: ({ request }) => {
      this.loading.set(true);
      return this.testResultService.getPage(request).pipe(
        map((res) => {
          this.loading.set(false);
          this.totalRecords = res.data.totalCount;
          const enrichedItems = res.data.items.map((item, index) => ({
            ...item,
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
  onTestTypeChange() {
    console.log('testChange' + this.selectedTestType);
    this.filters.update((current) => ({
      ...current,
      status: this.selectedTestType, // o null si prefieres limpiar el filtro
    }));
  }

  // testsResultHistoryResource = rxResource({
  //   request: () => ({ userId: this.userId()! }),
  //   loader: ({ request }) =>
  //     this.testResultService.getTestResultByUserId(request.userId).pipe(
  //       map((response) => {
  //         if (!response!.success) {
  //           throw new Error(
  //             response!.message || 'Failed to fetch test histories'
  //           );
  //         }
  //         return {
  //           data: response!.data,
  //           count: response!.data.length,
  //         };
  //       })
  //     ),
  // });
}
