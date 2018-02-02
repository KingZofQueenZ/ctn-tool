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
    return this.http.post<User>('/api/users', user, {headers: headers, responseType: 'text' as 'json'});
  }

  // GET /users
  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  // GET /users/{user-id}
  getById(_id: string): Observable<User> {
    return this.http.get<User>('/api/users/' + _id);
  }

  // PUT /users/{user-id}
  update(user: User): Observable<any> {
    return this.http.put('/api/users/' + user._id, user, {headers: headers, responseType: 'text' as 'json'});
  }

  // DELETE /users/{user-id}
  delete(_id: string): Observable<User> {
    return this.http.delete<User>('/api/users/' + _id, {headers: headers, responseType: 'text' as 'json'});
  }
}
