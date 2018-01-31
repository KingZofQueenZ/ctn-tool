import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  // POST /users
  create(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user, {headers: headers, responseType: 'text' as 'json'}).pipe(
      catchError(this.handleError<User>('POST User'))
    );
  }

  // GET /users
  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
        catchError(this.handleError('GET User', []))
    );
  }

  // GET /users/{user-id}
  getById(_id: string): Observable<User> {
    return this.http.get<User>('/api/users/' + _id).pipe(
        catchError(this.handleError<User>('GET User id:' + _id))
    );
  }

  // PUT /users/{user-id}
  update(user: User): Observable<any> {
    return this.http.put('/users/' + user._id, user, {headers: headers, responseType: 'text' as 'json'}).pipe(
        catchError(this.handleError<User>('PUT User id:' + user._id))
    );
  }

  // DELETE /users/{user-id}
  delete(_id: string): Observable<User> {
    return this.http.delete<User>('/users/' + _id, {headers: headers, responseType: 'text' as 'json'}).pipe(
      catchError(this.handleError<User>('DELETE User id:' + _id))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

}
