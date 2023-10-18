import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { User } from 'src/app/models/user';
import { Event } from '../../models/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format, isAfter } from 'date-fns';

class UserTrial {
  user!: User;
  trial: boolean = false;
}

@Component({
  selector: 'app-event-list-item',
  animations: [
    trigger('opacityAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('400ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss'],
})
export class EventListItemComponent implements OnInit {
  @Input() event!: Event;
  is_registered: boolean = false;
  is_full: boolean = false;
  can_register: boolean = false;
  can_unregister: boolean = false;
  participant_string: string = '';
  date_string: string = '';
  user: User | undefined;
  lockIcon: boolean = false;
  icon: String = 'how_to_reg';
  color: String = 'green-text';
  participants: UserTrial[] = [];

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
  ) {
    const storageUser = localStorage.getItem('currentUser');

    if (storageUser) {
      this.user = JSON.parse(storageUser);
    }
  }

  ngOnInit(): void {
    this.getParticipants();
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
  private getParticipants() {
    this.participants = [];

    this.event.participant_ids.forEach((participant) => {
      this.participants.push({ user: participant, trial: false });
    });

    this.event.trial_workouts.forEach((trialParticipant: any) => {
      this.participants.push({
        user: {
          firstname: trialParticipant.firstname,
          lastname: trialParticipant.lastname,
          phone: trialParticipant.phone,
          _id: '',
          admin: false,
          email: '',
          password: '',
          token: '',
        },
        trial: true,
      });
    });
  }

  private addParticipant() {
    this.eventService.addParticipant(this.event._id, this.user!).subscribe({
      next: (result) => {
        this.event.participant_ids.push(this.user!);
        this.updateUser();
        this.updateEvent();
        this.icon = 'how_to_reg';
        this.color = 'green-text';

        this.snackBar.open(
          'Du wurdest erfolgreich für ' +
            this.event.name +
            ', am ' +
            this.date_string +
            ' angemeldet',
          '',
          {
            panelClass: ['green-snackbar'],
          },
        );
      },
      error: (e) => {
        this.snackBar.open('Du konntest nicht angemeldet werden!', '', {
          panelClass: ['red-snackbar'],
        });
      },
    });
  }

  private deleteParticipant() {
    this.lockIcon = true;
    this.eventService
      .deleteParticipant(this.event._id, this.user!._id)
      .subscribe({
        next: (result) => {
          this.event.participant_ids.splice(
            this.event.participant_ids.findIndex(
              (x) => x._id === this.user!._id,
            ),
            1,
          );
          this.updateUser();
          this.updateEvent();

          this.snackBar.open(
            'Du wurdest erfolgreich für ' +
              this.event.name +
              ', am ' +
              this.date_string +
              ' abgemeldet',
            '',
            {
              panelClass: ['green-snackbar'],
            },
          );
          this.lockIcon = false;
        },
        error: (e) => {
          this.snackBar.open('Du konntest nicht abgemeldet werden!', '', {
            panelClass: ['red-snackbar'],
          });
        },
      });
  }

  private updateEvent() {
    this.participant_string = this.participantCount();
  }

  private updateUser() {
    this.getParticipants();
    this.is_registered = this.registered();
    this.is_full = this.full();
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

  private dateString() {
    const date = format(
      new Date(this.event.date),
      'eeeeee. d MMM yyyy / HH:mm',
    );

    if (this.event.time_to) {
      return date + '-' + format(new Date(this.event.time_to), 'HH:mm');
    }
    return date + ' Uhr';
  }

  private participantCount() {
    if (this.event.max_participants) {
      return this.participants.length + '/' + this.event.max_participants;
    } else {
      return `${this.participants.length}`;
    }
  }

  private registered() {
    if (!this.user) {
      return false;
    }

    return (
      this.event.participant_ids.find((x) => x._id === this.user!._id) !==
      undefined
    );
  }

  private full() {
    return (
      this.event.max_participants != undefined &&
      this.participants.length >= this.event.max_participants
    );
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
