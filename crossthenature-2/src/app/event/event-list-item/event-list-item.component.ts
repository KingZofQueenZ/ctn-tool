import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { User } from 'src/app/models/user';
import { Event } from '../../models/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format, isAfter } from 'date-fns';
import { HelperService } from 'src/app/services/helper.service';
import { EventDateFormatPipe } from 'src/app/shared/event-date-format-pipe.pipe';

@Component({
  selector: 'app-event-list-item',
  animations: [
    trigger('opacityAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms 200ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('400ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss'],
})
export class EventListItemComponent implements OnInit {
  @Input() event!: Event;
  user: User | undefined;
  is_registered: boolean = false;
  is_full: boolean = false;
  can_register: boolean = false;
  can_unregister: boolean = false;
  participant_string: string = '';
  lockIcon: boolean = false;
  icon: String = 'how_to_reg';
  color: String = 'green-text';

  constructor(
    private eventService: EventService,
    private helper: HelperService,
    private eventDateFormat: EventDateFormatPipe,
  ) {
    const storageUser = localStorage.getItem('currentUser');
    if (storageUser) {
      this.user = JSON.parse(storageUser);
    }
  }

  ngOnInit(): void {
    this.helper.combineTrialParticipants(this.event);

    this.can_register = this.canRegister();
    this.can_unregister = this.canUnregister();

    if (this.user) {
      this.is_registered = this.registered();
      this.is_full = this.full();
      this.participant_string = this.participantCount();
    }
  }

  handleRegistration(): void {
    if (this.registered()) {
      this.deleteParticipant();
    } else {
      this.addParticipant();
    }
  }

  private addParticipant() {
    this.eventService.addParticipant(this.event._id, this.user!).subscribe({
      next: () => {
        this.event.participant_ids.unshift(this.user!);
        this.updateUser();
        this.icon = 'how_to_reg';
        this.color = 'green-text';
        this.helper.successSnackbar('Du wurdest erfolgreich für ' + this.event.name + ', am ' + this.eventDateFormat.transform(this.event) + ' angemeldet');
      },
      error: () => this.helper.errorSnackbar('Es ist ein Fehler aufgetreten.'),
    });
  }

  private deleteParticipant() {
    this.lockIcon = true;
    this.eventService.deleteParticipant(this.event._id, this.user!._id).subscribe({
      next: () => {
        this.helper.removeParticipantFromArray(this.event, this.user!._id);
        this.updateUser();
        this.helper.successSnackbar('Du wurdest erfolgreich für ' + this.event.name + ', am ' + this.eventDateFormat.transform(this.event) + ' abgemeldet');
        this.lockIcon = false;
      },
      error: () => this.helper.errorSnackbar('Es ist ein Fehler aufgetreten.'),
    });
  }

  private updateUser() {
    this.is_registered = this.registered();
    this.is_full = this.full();
    this.participant_string = this.participantCount();
  }

  private canRegister() {
    if (this.event.sign_in) {
      return isAfter(new Date(this.event.sign_in), new Date());
    }
    return true;
  }

  private canUnregister() {
    if (this.event.sign_out) {
      return isAfter(new Date(this.event.sign_out), new Date());
    }
    return true;
  }

  private registered() {
    if (this.user) {
      return this.event.participant_ids.find((x) => x._id === this.user!._id) !== undefined;
    }
    return false;
  }

  private full() {
    return this.event.max_participants != undefined && this.event.participant_ids.length >= this.event.max_participants;
  }

  private participantCount() {
    if (this.event.max_participants) {
      return this.event.participant_ids.length + '/' + this.event.max_participants;
    } else {
      return `${this.event.participant_ids.length}`;
    }
  }

  mouseEnter() {
    this.icon = 'person_remove  ';
    this.color = 'red-text';
  }

  mouseLeave() {
    if (!this.lockIcon) {
      this.icon = 'how_to_reg';
      this.color = 'green-text';
    }
  }
}
