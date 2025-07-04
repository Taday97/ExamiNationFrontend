import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';
import { ApiResponse } from '@test/interfaces/api-response.interface';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ScoreRange,
  ScoreRanges,
  ScoreRangesResponse,
} from '@shared/interfaces/score-ranges';
import { AbstractCrudService } from '@shared/services/abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreRangesService
  extends AbstractCrudService<ScoreRange,ScoreRangesResponse>
  implements IDeleteService<ApiResponse<ScoreRangesResponse>>
{
  constructor(http: HttpClient) {
    super(http, `${environment.baseUrl}/ScoreRange`);
  }

  delete(id: string): Observable<ApiResponse<ScoreRangesResponse>> {
    return this.http.delete<ApiResponse<ScoreRangesResponse>>(
      `${this.baseUrl}/${id}`
    );
  }
  getPage(option: QueryOptions): Observable<PagesResponse<ScoreRanges>> {
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
      .get<PagesResponse<ScoreRanges>>(`${this.baseUrl}/pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
  getNextMinScore(testId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/test/${testId}/next-minScore`);
  }
}
