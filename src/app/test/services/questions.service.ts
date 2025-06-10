import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Options } from '@test/interfaces/option.interface';
import { QuestionsResponse } from '@test/interfaces/question.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  constructor() {}
  private http = inject(HttpClient);

  getQuetionsPage(option: Options): Observable<QuestionsResponse> {
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
      .get<QuestionsResponse>(`${baseUrl}/question/paged-with-test`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.questions.filters)));
  }


}
