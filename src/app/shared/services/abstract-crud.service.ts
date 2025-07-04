import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export abstract class AbstractCrudService<T,TResponse> {
  constructor(protected http: HttpClient, protected baseUrl: string) {}

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  update(id: string, item: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item);
  }
  getAll(): Observable<TResponse> {
    return this.http
      .get<TResponse>(`${this.baseUrl}`)
      .pipe(tap((resp) => console.log(resp)));
  }
}
