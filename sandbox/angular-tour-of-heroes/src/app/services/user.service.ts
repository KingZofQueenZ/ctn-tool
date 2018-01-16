import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {  RequestOptions, Request, RequestOptionsArgs, Headers } from "@angular/http";

let headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/users').pipe(
        tap(user => this.log('fetched users')),
        catchError(this.handleError('getUsers', []))
    )
  } 

  getById(_id: string): Observable<User> {
    return this.http.get<User>('/users/' + _id).pipe(
        tap(user => this.log('fetched user id=' + _id)),
        catchError(this.handleError<User>('getUser id=' + _id))
    )
  }

  create(user: User): Observable<User> {
    return this.http.post<User>('/users/register', user, {headers: headers, responseType: 'text' as 'json'}).pipe(
        tap(user => this.log('added user')),
        catchError(this.handleError<User>('add h User'))
    )
  }

  update(user: User): Observable<any> {
    const id = user._id;

    return this.http.put('/users/' + user._id, user, {headers: headers, responseType: 'text' as 'json'}).pipe(
        tap(user => this.log('update user id=' + id)),
        catchError(this.handleError<User>('update id=' + id))
    );
  }

  delete(_id: string): Observable<User> {
      return this.http.delete<User>('/users/' + _id, {headers: headers, responseType: 'text' as 'json'}).pipe(
        tap(user => this.log('deleted user' + _id)),
        catchError(this.handleError<User>('delete User' + _id))
    );
  }
  
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('in handleError ##############');
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
    
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
    
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
