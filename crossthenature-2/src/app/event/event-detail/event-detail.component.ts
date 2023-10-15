import { Component } from '@angular/core';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

class UserTrial {
  user!: User;
  trial: boolean = false;
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent {
  model: any = {};
  event!: Event;
  user: User | undefined;
  is_registered: boolean = false;
  is_full: boolean = false;
  can_register: boolean = false;
  can_unregister: boolean = false;
  date_string: string = '';
  date_string_anmeldung: string = '';
  date_string_abmeldung: string = '';
  trial_success: boolean = false;
  participant_string: string = '';

  participants: UserTrial[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    moment.locale('de');

    const storageUser = localStorage.getItem('currentUser');
    if (storageUser) {
      this.user = JSON.parse(storageUser);
    }

    this.getEvent();
  }

  getEvent() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.router.navigate(['/home']);
    }

    if (this.user) {
      this.eventService.getById(id!).subscribe((event) => {
        this.setEvent(event);
      });
    } else {
      this.eventService.getByIdPublic(id!).subscribe((event) => {
        this.setEvent(event);
      });
    }
  }

  private setEvent(event: Event) {
    this.event = event;
    this.getParticipants();
    this.date_string = this.dateString();
    this.date_string_anmeldung = this.dateStringDeadline(this.event.sign_in);
    this.date_string_abmeldung = this.dateStringDeadline(this.event.sign_out);
    this.is_registered = this.registered();
    this.can_register = this.canRegister();
    this.can_unregister = this.canUnregister();
    this.is_full = this.full();
    this.participant_string = this.participantCount();
  }

  handleRegistration(): void {
    if (this.registered()) {
      this.deleteParticipant();
    } else {
      this.addParticipant();
    }
  }

  handleTrialWorkout(): void {
    this.eventService
      .addTrialParticipant(
        this.event._id,
        this.model.firstname,
        this.model.lastname,
        this.model.phone,
      )
      .subscribe({
        next: () => {
          this.trial_success = true;
        },
        error: (e) => {
          this.snackBar.open('Es ist ein Fehler aufgetreten.', '', {
            panelClass: ['red-snackbar'],
          });
        },
      });
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
        this.snackBar.open('Es ist ein Fehler aufgetreten.', '', {
          panelClass: ['red-snackbar'],
        });
      },
    });
  }

  private deleteParticipant() {
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
        },
        error: (e) => {
          this.snackBar.open('Es ist ein Fehler aufgetreten.', '', {
            panelClass: ['red-snackbar'],
          });
        },
      });
  }

  private updateUser() {
    this.getParticipants();
    this.is_registered = this.registered();
    this.is_full = this.full();
    this.participant_string = this.participantCount();
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
      return date + '-' + moment(this.event.time_to).format('HH:mm');
    }
    return date + ' Uhr';
  }

  private dateStringDeadline(date: Date | undefined) {
    if (!date) {
      return '';
    }

    return moment(date).format('dd. D MMM YYYY / HH:mm') + ' Uhr';
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

  private participantCount() {
    if (this.event.max_participants) {
      return this.participants.length + '/' + this.event.max_participants;
    } else {
      return `${this.participants.length}`;
    }
  }
}
