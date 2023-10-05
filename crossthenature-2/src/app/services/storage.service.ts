import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class StorageService {
  storageSub = new Subject<string>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageSub.next(key);
  }

  updateItem(user: User) {
    const storageItem = localStorage.getItem('currentUser');

    if (!storageItem) {
      return;
    }

    const editedUser = JSON.parse(storageItem);

    editedUser.email = user.email;
    editedUser.firstname = user.firstname;
    editedUser.lastname = user.lastname;
    editedUser.phone = user.phone;

    localStorage.setItem('currentUser', JSON.stringify(editedUser));
    this.storageSub.next('currentUser');
  }
}
