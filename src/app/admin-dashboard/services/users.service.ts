import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';
import { ApiResponse } from '@test/interfaces/api-response.interface';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  User,
  Users,
  UsersResponse,
} from '@shared/interfaces/users.interface';
import { AbstractCrudService } from '@shared/services/abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService
  extends AbstractCrudService<User,UsersResponse>
  implements IDeleteService<ApiResponse<UsersResponse>>
{
  constructor(http: HttpClient) {
    super(http, `${environment.baseUrl}/User`);
  }

  delete(id: string): Observable<ApiResponse<UsersResponse>> {
    return this.http.delete<ApiResponse<UsersResponse>>(
      `${this.baseUrl}/${id}`
    );
  }
  getPage(option: QueryOptions): Observable<PagesResponse<Users>> {
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
      .get<PagesResponse<Users>>(`${this.baseUrl}/pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters)));
  }
  getNextMinScore(testId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/test/${testId}/next-minScore`);
  }
}
