import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { QueryOptions } from '@shared/interfaces/query-option.interface';
import { PagesResponse } from '@test/interfaces/pages-response.interface';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteService } from '../../shared/services/interfaces/delete-service.interface';
import {
  CognitiveCategories,
  CognitiveCategoriesResponse,
  CognitiveCategory
} from '@shared/interfaces/cognitve-category';
import { ApiResponse } from '@test/interfaces/api-response.interface';
import { AbstractCrudService } from '@shared/services/abstract-crud.service';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class CognitiveCategoryService
 extends AbstractCrudService<CognitiveCategory,CognitiveCategoriesResponse>
   implements IDeleteService<ApiResponse<CognitiveCategoriesResponse>>
 {
   constructor(http: HttpClient) {
     super(http, `${environment.baseUrl}/CognitiveCategory`);
   }

   delete(id: string): Observable<ApiResponse<CognitiveCategoriesResponse>> {
     return this.http.delete<ApiResponse<CognitiveCategoriesResponse>>(
       `${this.baseUrl}/${id}`
     );
   }
   getPage(option: QueryOptions): Observable<PagesResponse<CognitiveCategories>> {
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
       .get<PagesResponse<CognitiveCategories>>(`${this.baseUrl}/pages`, {
         params,
       })
       .pipe(tap((resp) => console.log('page' + resp.data.filters)));
   }
   getNextMinScore(testId: string): Observable<number> {
     return this.http.get<number>(
       `${this.baseUrl}/test/${testId}/next-minScore`
     );
   }
 }
