import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';
import { CognitiveCategory, CognitiveCategoryResponse } from '@shared/interfaces/cognitve-category';
import { ApiResponse } from '@test/interfaces/api-response.interface';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScoreRange, ScoreRangesResponse } from '@shared/interfaces/score-ranges';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ScoreRangesService implements IDeleteService<ApiResponse<ScoreRange>> {
  constructor() {}
  private http = inject(HttpClient);

  delete(id: string): Observable<ApiResponse<ScoreRange>> {
    return this.http.delete<ApiResponse<ScoreRange>>(`${baseUrl}/scoreRange/${id}`);
  }
  getPage(option: QueryOptions): Observable<PagesResponse<ScoreRangesResponse>> {
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
      .get<PagesResponse<ScoreRangesResponse>>(`${baseUrl}/scoreRange/pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
}
