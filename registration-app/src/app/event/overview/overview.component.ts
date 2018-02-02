import { Component, OnInit } from '@angular/core';
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
export class OverviewComponent implements OnInit {
  events: Event[];
  user: User;
  count: string;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.getEvents();
    moment.locale('de');

    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  getEvents(): void {
    this.eventService.getAll().subscribe(events => {
      this.events = events;

      this.events.forEach(event => {
        const date = moment(event.date).utc().format('dd. D MMM. YYYY / HH:mm');
        const time_to = moment(event.time_to).utc().format('HH:mm');
        event.date_string = date + '-' + time_to;

        this.setParticipantCountString(event);

        event.participant_ids.forEach(element => {
          if (element._id === this.user._id) {
            event.is_registered = true;
          }
        });
      });
    });
  }

  setParticipantCountString(event: Event): void {
    if (event.max_participants) {
      event.participant_count_string =  event.participant_ids.length + '/' + event.max_participants;
    } else {
      event.participant_count_string =  event.participant_ids.length;
    }
  }

  handleRegistration(event: Event): void {
    if (event.is_registered) {
      this.eventService.deleteParticipant(event._id, this.user._id).subscribe(
        result => {
        },
        error => {
          console.log(error);
        },
        () => {
          const index = event.participant_ids.indexOf(this.user._id);
          event.participant_ids.splice(index, 1);

          this.setParticipantCountString(event);
          event.is_registered = false;
      });
    } else {
      this.eventService.addParticipant(event._id, this.user).subscribe(
        result => {
        },
        error => {
          console.log(error);
        },
        () => {
          event.participant_ids.push(this.user._id);
          this.setParticipantCountString(event);
          event.is_registered = true;
      });
    }
  }
}
