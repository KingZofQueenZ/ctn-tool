import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, map } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>('/api/users/authenticate', {
        email: email,
        password: password,
      })
      .pipe(
        map((user: User) => {
          if (user && user.token) {
            this.storageService.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }),
      );
  }

  refresh(email: String): Observable<any> {
    return this.http.post<any>('/api/users/refresh', { email: email }).pipe(
      map((user: User) => {
        if (user && user.token) {
          this.storageService.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }),
    );
  }

  logout() {
    this.storageService.removeItem('currentUser');
  }
}
