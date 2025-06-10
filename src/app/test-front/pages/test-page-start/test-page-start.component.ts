import {
  SubmitAnswerRequest,
  TestResultResponse,
} from '@test/interfaces/submitAnswer.interface';
import { Component, inject, signal } from '@angular/core';
import { QuestionCardComponent } from '@test/components/question-card/question-card.component';
import { QuestionNavigationComponent } from '@test/components/question-navigation/question-navigation.component';
import { TestProgressComponent } from '@test/components/test-progress/test-progress.component';
import { TestIntroductionComponent } from '@test/components/test-introduction/test-introduction.component';
import { QuestionsService } from '@test/services/questions.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Test } from '@test/interfaces/test.interface';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { TestResultService } from '@test/services/testResult.service';
import { LoadingService } from '@shared/services/loadingService .service';

@Component({
  selector: 'test-page-start',
  imports: [
    QuestionCardComponent,
    QuestionNavigationComponent,
    TestProgressComponent,
    TestIntroductionComponent,
  ],
  templateUrl: './test-page-start.component.html',
})
export class TestPageStartComponent {
  routeActive = inject(ActivatedRoute);
  router = inject(Router);
  questionsService = inject(QuestionsService);
  paginationService = inject(PaginationService);
  testResultService = inject(TestResultService);
  loadingService = inject(LoadingService);

  time = signal<number>(0);
  timerInterval: any;
  testId = toSignal(
    this.routeActive.paramMap.pipe(map((params) => params.get('testId')))
  );
  test = signal<Test | null>(null);
  countPage = signal<number>(1);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      this.time.set(this.time() + 1);
    }, 1000);
  }
  onOptionSelected(optionSelect: SubmitAnswerRequest, results : boolean | null = null): void {
    if (this.paginationService.currentPage() <= this.countPage()) {
      this.testResultService.submitAnswer(optionSelect).subscribe({
        next: (response: TestResultResponse) => {
          const id = response.id;
          if (this.paginationService.currentPage() == this.countPage() || results) {
            this.loadingService.showProgress();
            setTimeout(() => {
              this.router.navigate(['/test-result', id, 'details']);
              this.loadingService.hideProgress();
            }, 3000);
          } else {
            if (
              this.countPage() != null &&
              this.paginationService.currentPage() < this.countPage()!
            ) {
              this.paginationService.goToPage(
                this.paginationService.currentPage() + 1
              );
            }
          }
        },
        error: (error) => {
          const backendMessage =
            error.error || 'Unknown error while fetching questions.';
          this.errorMessage.set(backendMessage);
        },
      });
    }
  }

  questionsResource = rxResource({
    request: () => ({
      testId: this.testId(),
      pageNumber: this.paginationService.currentPage(),
    }),
    loader: ({ request }) => {
      return this.questionsService
        .getQuetionsPage({
          filters: { testId: request.testId! },
          sortBy: 'questionNumber',
          sortDescending: false,
          pageNumber: request.pageNumber,
          pageSize: 1,
        })
        .pipe(
          map((response) => {
            this.test.set(response.data.test);
            this.countPage.set(response.data.questions.totalCount);
            return response.data.questions;
          }),
          catchError((error) => {
            const backendMessage =
              error.error || 'Unknown error while fetching questions.';
            this.errorMessage.set(backendMessage);
            this.test.set(null);
            return of(null);
          })
        );
    },
  });
}
