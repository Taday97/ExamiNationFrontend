import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';

import { ApiResponse } from '@test/interfaces/api-response.interface';
import { OptionData, OptionPagesResponse, OptionResponse } from '@shared/interfaces/option.interface';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class OptionService
  implements IDeleteService<ApiResponse<OptionData>>
{
  constructor() {}
  private http = inject(HttpClient);

  delete(id: string): Observable<ApiResponse<OptionData>> {
    return this.http.delete<ApiResponse<OptionData>>(
      `${baseUrl}/option/${id}`
    );
  }
  getAll(): Observable<OptionResponse> {
    return this.http
      .get<OptionResponse>(`${baseUrl}/option`)
      .pipe(tap((resp) => console.log(resp)));
  }
  getPage(
    option: QueryOptions
  ): Observable<ApiResponse<OptionPagesResponse>> {
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
      .get<ApiResponse<OptionPagesResponse>>(
        `${baseUrl}/option/pages`,
        {
          params,
        }
      )
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
}
