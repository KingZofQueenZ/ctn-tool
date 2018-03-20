import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event';
import * as moment from 'moment';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss']
})
export class NextEventComponent implements OnInit {
  @Input() event: Event;
  date_string: string;

  constructor() {
    moment.locale('de');
  }

  ngOnInit() {
    this.date_string = this.getDateString();
    this.getTrialWorkouts();
  }

  private getDateString() {
    const date = moment(this.event.date).format('dd. D MMM YYYY / HH:mm');

      if (this.event.time_to) {
        const time_to = moment(this.event.time_to).format('HH:mm');
        return date + '-' + time_to;
      }

      return date + 'Uhr';
  }

  private getTrialWorkouts() {
    this.event.trial_workouts.forEach(element => {
      this.event.participant_ids.push({ _id: element._id, firstname: element.firstname, lastname: element.lastname, phone: element.phone, trial: true});
    });
  }
}
