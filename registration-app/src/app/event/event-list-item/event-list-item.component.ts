import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss']
})
export class EventListItemComponent implements OnInit {
  @Input() event: Event;
  user: User;
  date_string: string;
  participant_count_string: string;
  is_registered: Boolean;
  is_full: Boolean;
  icon: String = 'done';
  color: String = 'green-text';

  constructor(private eventService: EventService, private toasterService: ToasterService) {
    moment.locale('de');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.date_string = this.setDateString();
    this.participant_count_string = this.setParticipantCountString();
    this.is_registered = this.checkIfRegistered();
    this.is_full = this.checkIfFull();
  }

  private setDateString(): string {
    const date = moment(this.event.date).utc().format('dd. D MMM YYYY');

    if (this.event.time_from) {
      const time_from = moment(this.event.time_from).utc().format('HH:mm');

      if (this.event.time_to) {
        const time_to = moment(this.event.time_to).utc().format('HH:mm');
        return date + ' / ' + time_from + '-' + time_to;
      }

      return date + ' / ' + time_from + ' Uhr';
    }

    return date;
  }

  private setParticipantCountString(): string {
    if (this.event.max_participants) {
      return this.event.participant_ids.length + '/' + this.event.max_participants;
    } else {
      return this.event.participant_ids.length;
    }
  }

  private checkIfRegistered(): Boolean {
    let val = false;

    this.event.participant_ids.forEach(element => {
      if (this.user && element._id === this.user._id) {
        val = true;
      }
    });
    return val;
  }

  private checkIfFull(): Boolean {
    let val = false;

    if (this.event.max_participants && this.event.participant_ids.length >= this.event.max_participants) {
      val = true;
    }
    return val;
  }

  handleRegistration(): void {
    if (this.is_registered) {
      this.eventService.deleteParticipant(this.event._id, this.user._id).subscribe(
        result => {
          const index = this.event.participant_ids.indexOf(this.user._id);
          this.event.participant_ids.splice(index, 1);

          this.participant_count_string = this.setParticipantCountString();
          this.is_registered = false;
          this.is_full = this.checkIfFull();

          const toast: Toast = {
            type: 'success',
            title: 'Abmeldung erfolgreich',
            body: 'Sie wurden erfolgreich für ' + this.event.name + ' abgemeldet'
          };
          this.toasterService.pop(toast);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.eventService.addParticipant(this.event._id, this.user).subscribe(
        result => {
          this.event.participant_ids.push(this.user._id);
          this.participant_count_string = this.setParticipantCountString();
          this.is_registered = true;
          this.is_full = this.checkIfFull();

          const toast: Toast = {
            type: 'success',
            title: 'Anmeldung erfolgreich',
            body: 'Sie wurden erfolgreich für ' + this.event.name + ' angemeldet'
          };
          this.toasterService.pop(toast);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  mouseEnter() {
    this.icon = 'close';
    this.color = 'red-text';
  }

  mouseLeave() {
    this.icon = 'done';
    this.color = 'green-text';
  }
}
