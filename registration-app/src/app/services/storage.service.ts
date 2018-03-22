import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user';

@Injectable()
export class StorageService {
  storageSub= new Subject<string>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next(key);
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next(key);
  }

  updateItem(user: User) {
    const editedUser = JSON.parse(localStorage.getItem('currentUser'));

    editedUser.email = user.email;
    editedUser.firstname = user.firstname;
    editedUser.lastname = user.lastname;
    editedUser.phone = user.phone;

    localStorage.setItem('currentUser', JSON.stringify(editedUser));
    this.storageSub.next('currentUser');
  }
}
