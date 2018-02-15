import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment';
import {trigger, transition, style, animate, state} from '@angular/animations'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MzTooltipModule, MzButtonModule } from 'ng2-materialize';

@Component({
  selector: 'app-event-list-item',
  animations: [
    trigger(
      'opacityAnimation',
      [
        transition(
        ':enter', [
          style({opacity: 0}),
          animate('400ms 200ms', style({'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({'opacity': 1}),
          animate('400ms', style({'opacity': 0}))
        ],
      )]
    )
  ],
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss']
})
export class EventListItemComponent implements OnInit {
  @Input() event: Event;
  is_registered: Boolean;
  is_full: Boolean;
  can_register: Boolean;
  can_unregister: Boolean;
  participant_string: string;
  participant_list: string;
  date_string: string;
  user: User;
  lockIcon: Boolean = false;
  icon: String = 'done';
  color: String = 'green-text';

  constructor(private eventService: EventService, private toasterService: ToasterService) {
    moment.locale('de');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.date_string = this.dateString();
    this.can_register = this.canRegister();
    this.can_unregister = this.canUnregister();

    if (this.user) {
      this.updateUser();
    }
    this.updateEvent();
  }

  handleRegistration(): void {
    if (this.registered()) {
      this.deleteParticipant();
    } else {
      this.addParticipant();
    }
  }

  // Private Methods
  private addParticipant() {
    this.eventService.addParticipant(this.event._id, this.user).subscribe(
      result => {
        this.event.participant_ids.push({ _id: this.user._id, firstname: this.user.firstname, lastname: this.user.lastname});
        this.updateUser();
        this.updateEvent();
        this.icon = 'done';
        this.color = 'green-text';
        this.toasterService.pop('success', 'Anmeldung erfolgreich', 'Sie wurden erfolgreich für '
                                  + this.event.name + ', am ' + this.date_string + ' angemeldet');
      },
      error => {
        this.toasterService.pop('error', 'Fehler', 'Es ist ein Fehler aufgetreten. Bitte melden Sie sich beim Administrator!');
      }
    );
  }

  private deleteParticipant() {
    this.lockIcon = true;
    this.eventService.deleteParticipant(this.event._id, this.user._id).subscribe(
      result => {
        this.event.participant_ids.splice(this.event.participant_ids.indexOf(this.user._id), 1);
        this.updateUser();
        this.updateEvent();
        this.toasterService.pop('success', 'Abmeldung erfolgreich', 'Sie wurden erfolgreich für '
                                  + this.event.name + ', am ' + this.date_string + ' abgemeldet');
        this.lockIcon = false;
      },
      error => {
        this.toasterService.pop('error', 'Fehler', 'Es ist ein Fehler aufgetreten. Bitte melden Sie sich beim Administrator!');
      }
    );
  }

  private updateEvent() {
    this.participant_string = this.participantCount();
  }

  private updateUser() {
    this.is_registered = this.registered();
    this.is_full = this.full();
    this.participant_list = this.participantList();
  }

  private canRegister() {
    if (this.event.sign_in) {
      return moment(this.event.sign_in).isAfter(moment());
    }
    return true;
  }

  private canUnregister() {
    if (this.event.sign_out) {
      return moment(this.event.sign_out).isAfter(moment());
    }
    return true;
  }

  private dateString() {
    const date = moment(this.event.date).format('dd. D MMM YYYY / HH:mm');

    if (this.event.time_to) {
      return date +  '-' + moment(this.event.time_to).format('HH:mm');
    }
    return date + ' Uhr';
  }

  private participantCount() {
    if (this.event.max_participants) {
      return this.event.participant_ids.length + '/' + this.event.max_participants;
    } else {
      return this.event.participant_ids.length;
    }
  }

  private participantList() {
    let participants = '';

    this.event.participant_ids.forEach(participant => {
      if (!participants) {
        participants = participant.firstname + ' ' + participant.lastname;
      } else {
        participants += '</br>' + participant.firstname + ' ' + participant.lastname;
      }
    });
    return participants;
  }

  private registered() {
    return this.event.participant_ids.find(x => x._id === this.user._id) !== undefined;
  }

  private full() {
    return (this.event.max_participants && this.event.participant_ids.length >= this.event.max_participants);
  }

  mouseEnter() {
    this.icon = 'close';
    this.color = 'red-text';
  }

  mouseLeave() {
    if (!this.lockIcon) {
      this.icon = 'done';
      this.color = 'green-text';
    }
  }
}
