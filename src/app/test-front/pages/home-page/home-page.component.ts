import { Component, computed, inject, signal } from '@angular/core';
import { TestCardComponent } from '@test/components/test-card/test-card.component';
import { TestsService } from '@admin-dashboard/services/tests.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { TestType } from '@shared/interfaces/test.interface';

@Component({
  selector: 'app-home-page',
  imports: [TestCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  pageNumber = signal(1);
  sortField = signal('name');
  sortDescending = signal(false);
  filters = signal<{ [key: string]: string }>({
    isScoringComplete: 'true',
  });
  refreshTrigger = signal(false);
  totalRecords = 0;
  testsService = inject(TestsService);
  testUiService = inject(TestUiService);

  testsResource = rxResource({
    request: computed(() => ({
      pageNumber: this.pageNumber(),
      sortBy: this.sortField(),
      sortDescending: this.sortDescending(),
      filters: this.filters(),
      refresh: this.refreshTrigger(),
    })),
    loader: ({ request }) => {
      return this.testsService.getPage(request).pipe(
        map((res) => {
          this.totalRecords = res.data.totalCount;
          console.log(res.data.items);
          const items = res.data.items.map((item, index) => {
            return {
              ...item,
              typeName: TestType[item.type],
              testTypeData: this.testUiService.getTestTypeData(item.type),
              randomColor: this.testUiService.getRandomColor(index),
            };
          });
          console.error(items);
          return items;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
    },
  });
}
