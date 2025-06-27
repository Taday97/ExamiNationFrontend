import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { DataViewModule } from 'primeng/dataview';
import { TestResultHistory, TestResultSummary } from '@test/interfaces/test-result.interface';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { AnswersService } from '@admin-dashboard/services/answers.service';
import { PagesResponse } from '@test/interfaces/pages-response.interface';
import { AnswerResults } from '@shared/interfaces/answer';
import { LazyLoadEvent } from 'primeng/api';
import {  effect } from '@angular/core';
@Component({
  selector: 'app-answer-list',
  imports: [DataViewModule, CommonModule, DropdownModule],
  templateUrl: './answer-list.component.html',
})
export class AnswerListComponent {
  TestResultHistory = input.required<TestResultHistory>();

  loading = signal(false);
  totalRecords = 0;
  isFiltering = signal(false);

  pageSize = signal(2);
  pageNumber = signal(1);
  sortField = signal('Question.QuestionNumber');
  sortDescending = signal(true);
  filters = signal<{ [key: string]: string }>({});

  constructor() {
    effect(() => {
      const id = this.TestResultHistory()?.id;
      console.log('Test Result ID:', id);
      if (id) {
        this.filters.set({ testResultId: id });
      }
    });
  }

  refreshTrigger = signal(false);

  answerService = inject(AnswersService);

  answersResource = rxResource({
    request: computed(() => ({
      pageNumber: this.pageNumber(),
      sortBy: this.sortField(),
      sortDescending: this.sortDescending(),
      filters:{ testResultId: this.TestResultHistory()?.id },
      pageSize: this.pageSize(),
      refresh: this.refreshTrigger(),
    })),
    loader: ({ request }) => {
      this.loading.set(true);
      return this.answerService.getPageDetails(request).pipe(
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
    this.pageSize.set(event.rows);
    this.sortField.set(event.sortField || 'questionNumber');
    this.sortDescending.set(event.sortOrder == 1);

    const updatedFilters: { [key: string]: string } = {};
    for (const key in event.filters) {
      const filterValue = event.filters[key]?.value;
      if (filterValue) {
        updatedFilters[key] = filterValue;
      }
    }
    this.filters.set(updatedFilters);
  }
}
