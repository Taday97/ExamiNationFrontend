import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TestResultService } from '@shared/services/testResult.service';
import { DataViewModule } from 'primeng/dataview';
import {
  TestResultHistory,
  TestResultStatus,
  TestResultSummary,
} from '@test/interfaces/test-result.interface';
import { CamelCaseToSpacesPipe } from '../../../shared/pipes/camelCaseToSpaces.pipe';
import { rxResource } from '@angular/core/rxjs-interop';
import { QuestionsService } from '@shared/services/questions.service';

@Component({
  selector: 'app-admin-test-result-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CamelCaseToSpacesPipe,
    DataViewModule,
  ],
  providers: [MessageService, NotificationService],
  templateUrl: './admin-test-result-modal.component.html',
})
export class AdminTestResultModalComponent {
  constructor(private notificationService: NotificationService) {}
  @Output() refreshTrigger = new EventEmitter<boolean>();

  testResultStatus = TestResultStatus;
  dialog = signal(false);
  submitted = signal(false);

  private fb = inject(FormBuilder);
  testResultService = inject(TestResultService);
  questionsService = inject(QuestionsService);

  testResult = signal<TestResultSummary | null>(null);
  currentTest = this.testResult();
  isNew = !this.currentTest || this.currentTest.id === 'new';

  async loadTest(id: string) {
    try {
      const testResult = await firstValueFrom(
        this.testResultService.getTestResultSummary(id)
      );

      this.testResult.set(testResult!.data);
    } catch (error) {
      this.notificationService.error('Failed to load testresult data');
    }
  }
  questionsResource = rxResource({
    request: () => ({
      testId: this.testResult()?.testId,
      pageNumber: 1,
    }),
    loader: ({ request }) => {
      return this.questionsService
        .getQuetionsPage({
          filters: { testId: request.testId! },
          sortBy: 'questionNumber',
          sortDescending: false,
          pageNumber: request.pageNumber,
          pageSize: 2,
        })
        .pipe(
          map((response) => {

            const questions = response.data.questions.items.map((item: any) => {
              const selectedOption = item.options?.find(
                (opt: any) => opt.id === item.selectedOptionId
              );
              return {
                ...item,
                selectedOptionText: selectedOption?.text || null,
              };
            });
            console.log('Questions loaded:', questions);
            return questions;
          }),
          catchError((error) => {
            const backendMessage =
              error.error || 'Unknown error while fetching questions.';
            this.notificationService.error(backendMessage);
            return of(null);
          })
        );
    },
  });
  getStatusName(): string {
    const status = this.testResult()?.testResultDto?.status;
    var statusName = TestResultStatus[status!];
    return statusName ?? 'Desconocido';
  }
  get testDuration(): string | null {
    const result = this.testResult()?.testResultDto;

    if (!result?.startedAt || !result?.completedAt) return null;

    const start = new Date(result.startedAt);
    const end = new Date(result.completedAt);

    const diffMs = end.getTime() - start.getTime(); // diferencia en milisegundos
    const totalSeconds = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}min`);
    parts.push(`${seconds}sec`);

    return parts.join(' ');
  }

  get explanationList(): string[] {
    const explanation = this.testResult()?.detailedExplanation;
    if (!explanation) return [];

    return explanation
      .split(/\. +/) // punto seguido de uno o más espacios
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  }
  openModal(testresultResult?: TestResultHistory) {
    if (testresultResult) {
      this.loadTest(testresultResult!.id);
    } else {
      this.testResult.set(null);
    }
    this.dialog.set(true);
  }

  closeModal() {
    this.dialog.set(false);
  }
}
