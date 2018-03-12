import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import 'rxjs/add/operator/map';
import { StorageService } from './storage.service';

@Injectable()
export class AuthenticationService {

  constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/users/authenticate', { email: email, password: password })
        .map((user) => {
            if (user && user.token) {
                this.storageService.setItem('currentUser', JSON.stringify(user));
            }
            return user;
        });
  }

  logout() {
    this.storageService.removeItem('currentUser');
  }
}
