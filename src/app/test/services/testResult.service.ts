import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  SubmitAnswerRequest,
  TestResultResponse,
} from '@test/interfaces/submitAnswer.interface';
import {
  ApiResponse,
  TestResultHistory,
  TestResultSummary,
} from '@test/interfaces/test-result.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class TestResultService {
  constructor() {}
  private http = inject(HttpClient);
  private _resultTestId = signal<string | null>(
    localStorage.getItem('restultTestId')
  );
  resultId = computed<string | null>(() => this._resultTestId());

  submitAnswer(data: SubmitAnswerRequest): Observable<TestResultResponse> {
    return this.http
      .post<TestResultResponse>(`${baseUrl}/testResult/submit-answer`, data)
      .pipe(tap((resp) => this.handelSubmitSuccess(resp)));
  }
  handelSubmitSuccess(resp: TestResultResponse): void {
    this._resultTestId.set(resp.id);
    localStorage.setItem('restultTestId', resp.id);
  }
  getTestResultSummary(
    testResultId: string
  ): Observable<ApiResponse<TestResultSummary> | null> {
    return this.http.get<ApiResponse<TestResultSummary> | null>(
      `${baseUrl}/TestResult/${testResultId}/summary`
    );
  }
  getTestResultByUserId(
    userId: string
  ): Observable<ApiResponse<TestResultHistory[]> | null> {
    return this.http.get<ApiResponse<TestResultHistory[]> | null>(
      `${baseUrl}/TestResult/user/${userId}`
    );
  }
}
