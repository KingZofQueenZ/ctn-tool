import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class StorageService {
  storageSub= new Subject<string>();

  watchStorage(): Observable<any> {
    console.log('called');
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    console.log('item set');
    localStorage.setItem(key, data);
    this.storageSub.next(key);
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next(key);
  }
}
