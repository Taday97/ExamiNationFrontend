import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Questions,
  QuestionsResponse,
} from '@shared/interfaces/question.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Question, Filters } from '../interfaces/question.interface';
import { IDeleteService } from './interfaces/delete-service.interface';
import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';
import { AbstractCrudService } from './abstract-crud.service';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class QuestionsService
  extends AbstractCrudService<Question>
  implements IDeleteService<QuestionsResponse>
{
  constructor(http: HttpClient) {
    super(http, `${environment.baseUrl}/Question`);
  }

  delete(id: string): Observable<QuestionsResponse> {
    return this.http.delete<QuestionsResponse>(`${this.baseUrl}/Question/${id}`);
  }
  getQuetionsPage(option: QueryOptions): Observable<QuestionsResponse> {
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
      .get<QuestionsResponse>(`${baseUrl}/question/paged-with-question`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.questions.filters)));
  }
  getPage(option: QueryOptions): Observable<PagesResponse<Questions>> {
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
      .get<PagesResponse<Questions>>(`${baseUrl}/question/pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
  getNextQuestionNumber(testId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/test/${testId}/next-number`);
  }
}
