import { Observable } from 'rxjs';

export interface IDeleteService<TResponse> {
  delete(id: string): Observable<TResponse>;
}
