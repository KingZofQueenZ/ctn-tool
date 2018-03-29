import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Event } from '../models/event';
import { User } from '../models/user';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable()
export class EventService {

  constructor(private http: HttpClient) { }

  // POST /events
  create(event: Event): Observable<Event> {
    return this.http.post<Event>('/api/events', event, {headers: headers, responseType: 'text' as 'json'});
  }

  getDateDict(): Observable<any> {
    return this.http.get<any>('/api/helper/event-dates');
  }

  // GET /events
  getAll(page?: number): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events?page=' + page);
  }

  // GET /events/{event-id}
  getById(_id: string): Observable<Event> {
    return this.http.get<Event>('/api/events/' + _id);
  }

  getAmount(amount?: number): Observable<Event[]> {
    return this.http.get<Event[]>('api/events?amount=' + amount);
  }

  // PUT /events/{event-id}
  update(event: Event): Observable<any> {
    return this.http.put('/api/events/' + event._id, event, {headers: headers, responseType: 'text' as 'json'});
  }

  // DELETE /events/{event-id}
  delete(_id: string): Observable<Event> {
    return this.http.delete<Event>('/api/events/' + _id, {headers: headers, responseType: 'text' as 'json'});
  }

  // POST /events/{event-id}/participants
  addParticipant(eventId: string, user: User): Observable<Event> {
    return this.http.post<Event>('/api/events/' + eventId + '/participants/', user, {headers: headers, responseType: 'text' as 'json'});
  }

  // POST /events/{event-id}/participants
  addTrialParticipant(eventId: string, firstname: string, lastname: string, phone: string): Observable<Event> {
    return this.http.post<Event>('/api/events/' + eventId + '/trialparticipants/',
      { firstname: firstname, lastname: lastname, phone: phone }, {headers: headers, responseType: 'text' as 'json'});
  }

  // DELETE /events/{event-id}/participants/{participant-id}
  deleteParticipant(eventId: string, userId: string): Observable<Event> {
    return this.http.delete<Event>('/api/events/' + eventId + '/participants/' + userId + '/', {headers: headers, responseType: 'text' as 'json'});
  }

}
