import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  // POST /users
  create(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // PUT /users/activate/{code}
  activate(code: string): Observable<any> {
    return this.http.put('/api/users/activate/' + code, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // GET /users
  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  // GET /users/{user-id}
  getById(_id: string): Observable<User> {
    return this.http.get<User>('/api/users/' + _id);
  }

  // GET /:user_id/events
  getUserEvents(_id: string): Observable<any> {
    return this.http.get<User>('/api/users/' + _id + '/events');
  }

  // PUT /users/{user-id}
  update(user: User): Observable<any> {
    return this.http.put('/api/users/' + user._id, user, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // DELETE /users/{user-id}
  delete(_id: string): Observable<User> {
    return this.http.delete<User>('/api/users/' + _id, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // PUT /users/reset
  reset(model: any): Observable<any> {
    return this.http.put('/api/users/reset', model, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // PUT /users/resetchangepassword
  changepassword(model: any): Observable<any> {
    return this.http.put('/api/users/changepassword', model, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // POST /users
  contact(model: any): Observable<any> {
    return this.http.post<any>('/api/users/contact', model, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }
}
