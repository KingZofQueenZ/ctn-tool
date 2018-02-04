import { Component } from '@angular/core';
import { MzParallaxModule  } from 'ng2-materialize';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  events: Event[] = [];
  user: User;
  count: string;

  constructor(private eventService: EventService) {
    moment.locale('de');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getAll(1).subscribe(events => {
      events.forEach(event => {
        this.processData(event);
      });
      this.events = events;
    })
  }
  
  private processData(event:Event): void {

    event.date_string = this.setDateString(event);
    event.participant_count_string = this.setParticipantCountString(event);
    event.is_registered = this.checkIfRegistered(event);
  }

  private setDateString(event: Event): string {
    const date = moment(event.date).utc().format('dd. D MMM. YYYY / HH:mm');
    const time_to = moment(event.time_to).utc().format('HH:mm');
    return date + '-' + time_to;
  }

  private setParticipantCountString(event: Event): string {
    if (event.max_participants) {
      return event.participant_ids.length + '/' + event.max_participants;
    } else {
      return event.participant_ids.length;
    }
  }

  private checkIfRegistered(event: Event): Boolean {
    let val = false;

    event.participant_ids.forEach(element => {
      if (element._id === this.user._id) {
        console.log(true, event);
        val = true;
      }
    });
    return val;
  }

  handleRegistration(event: Event): void {
    if (event.is_registered) {
      this.eventService.deleteParticipant(event._id, this.user._id).subscribe(
        result => {
          const index = event.participant_ids.indexOf(this.user._id);
          event.participant_ids.splice(index, 1);

          event.participant_count_string = this.setParticipantCountString(event);
          event.is_registered = false;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.eventService.addParticipant(event._id, this.user).subscribe(
        result => {
          event.participant_ids.push(this.user._id);
          event.participant_count_string = this.setParticipantCountString(event);
          event.is_registered = true;
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
