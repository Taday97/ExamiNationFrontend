import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestResultService } from '@test/services/testResult.service';
import { map } from 'rxjs';
import { PerformanceCardCategoryComponent } from "../../components/performance-card-category/performance-card-category.component";

@Component({
  selector: 'test-page-results',
  imports: [DatePipe, RouterLink, PerformanceCardCategoryComponent],
  templateUrl: './test-page-results.component.html',
})
export class TestPageResultsComponent {
  private activatedRoute = inject(ActivatedRoute);
  testResultService = inject(TestResultService);
  router = inject(Router);
  testResultId = toSignal(
    this.activatedRoute.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: '' }
  );

  testsResultResource = rxResource({
    request: () => ({ testResultId: this.testResultId()! }),
    loader: ({ request }) =>
      this.testResultService.getTestResultSummary(request.testResultId).pipe(
        map((response) => {
          if (!response!.success) {
            throw new Error(response!.message || 'Failed to fetch summary');
          }
          return response!.data;
        })
      ),
  });

  get testDuration(): string | null {
    const result = this.testsResultResource.value()?.testResultDto;

    if (!result?.startedAt || !result?.completedAt) return null;

    const start = new Date(result.startedAt);
    const end = new Date(result.completedAt);

    const diffMs = end.getTime() - start.getTime(); // diferencia en milisegundos

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes} min ${seconds} sec`;
  }

  get explanationList(): string[] {
    const explanation = this.testsResultResource.value()?.detailedExplanation;
    if (!explanation) return [];

    return explanation
      .split(/\. +/) // punto seguido de uno o más espacios
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  }
}
