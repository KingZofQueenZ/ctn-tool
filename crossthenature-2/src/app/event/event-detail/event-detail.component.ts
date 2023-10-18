import { Component } from '@angular/core';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isAfter } from 'date-fns';
import { HelperService } from 'src/app/services/helper.service';
import { EventDateFormatPipe } from 'src/app/shared/event-date-format-pipe.pipe';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent {
  model: any = {}; // Trial Signup Form
  event!: Event;
  user: User | undefined;
  is_registered: boolean = false;
  is_full: boolean = false;
  can_register: boolean = false;
  can_unregister: boolean = false;
  trial_success: boolean = false;
  participant_string: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private helper: HelperService,
    private eventDateFormat: EventDateFormatPipe,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null) {
      this.router.navigate(['/home']);
    }

    const storageUser = localStorage.getItem('currentUser');
    if (storageUser) {
      this.user = JSON.parse(storageUser);
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
    this.helper.combineTrialParticipants(this.event);

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
    this.eventService.addTrialParticipant(this.event._id, this.model.firstname, this.model.lastname, this.model.phone).subscribe({
      next: () => (this.trial_success = true),
      error: () => this.helper.errorSnackbar('Es ist ein Fehler aufgetreten.'),
    });
  }

  // Private Methods
  private addParticipant() {
    this.eventService.addParticipant(this.event._id, this.user!).subscribe({
      next: () => {
        this.event.participant_ids.unshift(this.user!);
        this.updateUser();
        this.helper.successSnackbar('Du wurdest erfolgreich für ' + this.event.name + ', am ' + this.eventDateFormat.transform(this.event) + ' angemeldet');
      },
      error: () => this.helper.errorSnackbar('Es ist ein Fehler aufgetreten.'),
    });
  }

  private deleteParticipant() {
    this.eventService.deleteParticipant(this.event._id, this.user!._id).subscribe({
      next: () => {
        this.helper.removeParticipantFromArray(this.event, this.user!._id);
        this.updateUser();
        this.helper.successSnackbar('Du wurdest erfolgreich für ' + this.event.name + ', am ' + this.eventDateFormat.transform(this.event) + ' abgemeldet');
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
}
