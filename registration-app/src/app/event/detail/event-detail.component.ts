import { Component, Input, AfterViewChecked } from '@angular/core';
import { MzTooltipModule, MzButtonModule } from 'ng2-materialize';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  model: any = {};
  event: Event;
  user: User;
  is_registered: Boolean;
  is_full: Boolean;
  can_register: Boolean;
  can_unregister: Boolean;
  date_string: string;
  date_string_anmeldung: string;
  date_string_abmeldung: string;
  trial_success: Boolean = false;

  constructor(private route: ActivatedRoute, private eventService: EventService, private toasterService: ToasterService) {
    moment.locale('de');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getEvent();
  }

  getEvent() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getById(id).subscribe(event => {
      this.event = event;
      this.date_string = this.dateString();
      this.date_string_anmeldung = this.dateStringDeadline(this.event.sign_in);
      this.date_string_abmeldung = this.dateStringDeadline(this.event.sign_out);
      this.is_registered = this.registered();
      this.can_register = this.canRegister();
      this.can_unregister = this.canUnregister();
      this.getTrialWorkouts();
      this.is_full = this.full();
      console.log('Full', this.is_full);
    });
  }

  handleRegistration(): void {
    if (this.registered()) {
      this.deleteParticipant();
    } else {
      this.addParticipant();
    }
  }

  handleTrialWorkout(): void {
    this.eventService.addTrialParticipant(this.event._id, this.model.firstname, this.model.lastname, this.model.phone).subscribe(
      result => {
        this.trial_success = true;
      },
      error => {
        this.toasterService.pop('error', 'Fehler', 'Es ist ein Fehler aufgetreten.');
      }
    );
  }

  // Private Methods
  private addParticipant() {
    this.eventService.addParticipant(this.event._id, this.user).subscribe(
      result => {
        this.event.participant_ids.push({ _id: this.user._id, firstname: this.user.firstname, lastname: this.user.lastname});
        this.updateUser();
        this.toasterService.pop('success', 'Anmeldung erfolgreich', 'Du wurdest erfolgreich für '
                                  + this.event.name + ', am ' + this.date_string + ' angemeldet');
      },
      error => {
        console.log(error);
        this.toasterService.pop('error', 'Fehler', 'Es ist ein Fehler aufgetreten.');
      }
    );
  }

  private deleteParticipant() {
    console.log(this.event.participant_ids);
    this.eventService.deleteParticipant(this.event._id, this.user._id).subscribe(
      result => {
        this.event.participant_ids.splice(this.event.participant_ids.findIndex(x => x._id === this.user._id), 1);
        this.updateUser();
        this.toasterService.pop('success', 'Abmeldung erfolgreich', 'Du wurdest erfolgreich für '
                                  + this.event.name + ', am ' + this.date_string + ' abgemeldet');
      },
      error => {
        this.toasterService.pop('error', 'Fehler', 'Es ist ein Fehler aufgetreten.');
      }
    );
  }

  private getTrialWorkouts() {
    this.event.trial_workouts.forEach(element => {
      this.event.participant_ids.push({ _id: element._id, firstname: element.firstname, lastname: element.lastname, trial: true});
    });
  }

  private updateUser() {
    this.is_registered = this.registered();
    this.is_full = this.full();
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

  private dateStringDeadline(date: Date) {
    if (!date) {
      return null;
    }

    return moment(date).format('dd. D MMM YYYY / HH:mm') + ' Uhr';
  }

  private registered() {
    if (!this.user) {
      return false;
    }

    return this.event.participant_ids.find(x => x._id === this.user._id) !== undefined;
  }

  private full() {
    return (this.event.max_participants && this.event.participant_ids.length >= this.event.max_participants);
  }
}
