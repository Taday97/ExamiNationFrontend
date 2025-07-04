import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, firstValueFrom, map, of, single } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TestResultService } from '@admin-dashboard/services/testResult.service';
import { DataViewModule } from 'primeng/dataview';
import {
  TestResultStatus,
  TestResultSummary,
} from '@test/interfaces/test-result.interface';
import { CamelCaseToSpacesPipe } from '../../../../shared/pipes/camelCaseToSpaces.pipe';
import { rxResource } from '@angular/core/rxjs-interop';
import { AnswerListComponent } from '../answer-list/answer-list.component';
import { TestResultHistory } from '../../../../test/interfaces/test-result.interface';
import { TestUiService } from '@admin-dashboard/services/test-ui.service';
import { QuestionsService } from '@shared/services/questions.service';

@Component({
  selector: 'app-test-result-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CamelCaseToSpacesPipe,
    DataViewModule,
    AnswerListComponent,
  ],
  providers: [MessageService, NotificationService],
  templateUrl: './test-result-modal.component.html',
})
export class TestResultModalComponent {
  constructor(private notificationService: NotificationService) {}
  @Output() refreshTrigger = new EventEmitter<boolean>();

  visible = input(false);
  testResultStatus = TestResultStatus;
  dialog = signal(false);
  submitted = input(false);

  private fb = inject(FormBuilder);
  testResultService = inject(TestResultService);
  questionsService = inject(QuestionsService);

  testResult = signal<TestResultSummary | null>(null);
  testResultHistory = signal<TestResultHistory | null>(null);
  testUiService = inject(TestUiService);
  currentTest = this.testResult();
  isNew = !this.currentTest || this.currentTest.id === 'new';
  isOpen = false;
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
  async openModal(testresultResult?: TestResultHistory) {
    if (testresultResult) {
      this.testResultHistory.set(testresultResult); // primero seteas

      await this.loadTest(testresultResult.id); // luego haces la carga
    } else {
      this.testResult.set(null);
      this.testResultHistory.set(null);
    }
    this.dialog.set(true); // abres el modal después
  }

  closeModal() {
    this.dialog.set(false);
  }
}
