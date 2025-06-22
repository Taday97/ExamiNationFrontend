import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { ApiResponse } from '@test/interfaces/api-response.interface';
import {
  SubmitAnswerRequest,
  TestResultResponse,
} from '@test/interfaces/submitAnswer.interface';
import {
  TestResultHistory,
  TestResultPagesResponse,
  TestResultSummary,
} from '@test/interfaces/test-result.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from './interfaces/delete-service.interface';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class TestResultService implements IDeleteService<TestResultResponse> {
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
  getPage(
    option: QueryOptions
  ): Observable<ApiResponse<TestResultPagesResponse>> {
    const {
      filters = {},
      sortBy = '',
      sortDescending = false,
      pageNumber = 1,
      pageSize = 10,
    } = option;

    const params: { [key: string]: string } = {
      SortBy: sortBy,
      SortDescending: String(sortDescending),
      PageNumber: String(pageNumber),
      PageSize: String(pageSize),
    };

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        params[`filters[${key}]`] = filters[key];
      }
    }
    return this.http
      .get<ApiResponse<TestResultPagesResponse>>(`${baseUrl}/TestResult/pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
  delete(id: string): Observable<TestResultResponse> {
    return this.http.delete<TestResultResponse>(`${baseUrl}/TestResult/${id}`);
  }
}
