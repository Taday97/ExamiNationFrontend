import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';
import { OptionsResponse } from '@shared/interfaces/option.interface';
import { Option, Question, Questions } from '@shared/interfaces/question.interface';
import { AnswerResults } from '@shared/interfaces/answer';


const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class AnswersService implements IDeleteService<OptionsResponse> {
  constructor() {}
  private http = inject(HttpClient);

  delete(id: string): Observable<OptionsResponse> {
    return this.http.delete<OptionsResponse>(`${baseUrl}/answer/${id}`);
  }
  getPageDetails(option: QueryOptions): Observable<PagesResponse<AnswerResults>> {
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
      .get<PagesResponse<AnswerResults>>(`${baseUrl}/answer/details`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
}
