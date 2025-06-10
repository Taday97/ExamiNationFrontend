import { HttpClient } from '@angular/common/http';
import {
  Test,
  TestPagesResponse,
  TestsResponse,
  TestType,
} from '../interfaces/test.interface';
import { Options } from '../interfaces/option.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { inject, Injectable } from '@angular/core';

const baseUrl = environment.baseUrl;

const emptyTest: Test = {
  id: 'new',
  name: '',
  description: '',
  type: TestType.IQ,
  imageUrl: '',
  createdAt: new Date(),
};

@Injectable({ providedIn: 'root' })
export class TestsService {
  private http = inject(HttpClient);

  getTestByType(type: number): Observable<TestsResponse> {
    return this.http
      .get<TestsResponse>(`${baseUrl}/test/by-type/${type}`, {})
      .pipe(tap((resp) => console.log(resp)));
  }
  getTestPage(option: Options): Observable<TestPagesResponse> {
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
      .get<TestPagesResponse>(`${baseUrl}/test/get-pages`, {
        params,
      })
      .pipe(tap((resp) => console.log('page' + resp.data.filters.type)));
  }

  getTest(): Observable<TestsResponse> {
    return this.http
      .get<TestsResponse>(`${baseUrl}/test`)
      .pipe(tap((resp) => console.log(resp)));
  }

  private buildFormData(imageFile?: File | null): FormData {
    const formData = new FormData();

    if (imageFile) {
      // Solo se acepta 1 imagen como 'ImageUrl'
      formData.append('ImageUrl', imageFile);
    }

    return formData;
  }

  createTest(
    testLike: Partial<Test>,
    imageFile?: File | null
  ): Observable<Test> {
    const queryParams = new URLSearchParams({
      Name: testLike.name || '',
      Description: testLike.description || '',
      Type: (testLike.type ?? 0).toString(),
    });

    const url = `${baseUrl}/Test?${queryParams.toString()}`;
    const formData = this.buildFormData(imageFile);

    return this.http.post<Test>(url, formData);
  }

  updateTest(
    id: string,
    testLike: Partial<Test>,
    imageFile?: File | null
  ): Observable<Test> {
    console.log(testLike.id);

    const queryParams = new URLSearchParams({
      Id: testLike.id || '',
      Name: testLike.name || '',
      Description: testLike.description || '',
      Type: (testLike.type ?? 0).toString(),
      ImageUrl: testLike.imageUrl || '',
    });

    const url = `${baseUrl}/Test/${id}?${queryParams.toString()}`;

    const formData = new FormData();

    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }

    return this.http.put<Test>(url, formData);
  }

  getTestById(id: string): Observable<Test> {
    if (id === 'new') {
      return of(emptyTest);
    }
    return this.http.get<Test>(`${baseUrl}/Test/${id}`);
  }
  deleteTest(id: string): Observable<TestsResponse> {
    return this.http.delete<TestsResponse>(`${baseUrl}/Test/${id}`);
  }
}
