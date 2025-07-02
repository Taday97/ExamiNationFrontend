import { Observable } from 'rxjs';

export interface CrudService<T> {
  getById(id: string): Observable<T>;
  create(item: Partial<T>): Observable<T>;
  update(id: string, item: Partial<T>): Observable<T>;
}

