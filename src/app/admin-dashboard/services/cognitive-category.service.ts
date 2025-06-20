import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';
import { CognitiveCategory, CognitiveCategoryResponse } from '@shared/interfaces/cognitve-category';
import { ApiResponse } from '@test/interfaces/api-response.interface';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class CognitiveCategoryService implements IDeleteService<ApiResponse<CognitiveCategory>> {
  constructor() {}
  private http = inject(HttpClient);

  delete(id: string): Observable<ApiResponse<CognitiveCategory>> {
    return this.http.delete<ApiResponse<CognitiveCategory>>(`${baseUrl}/cognitiveCategory/${id}`);
  }
  getPage(option: QueryOptions): Observable<PagesResponse<CognitiveCategoryResponse>> {
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
      .get<PagesResponse<CognitiveCategoryResponse>>(`${baseUrl}/cognitiveCategory/pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
}

