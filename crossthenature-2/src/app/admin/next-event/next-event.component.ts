import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import * as moment from 'moment';
import { User } from 'src/app/models/user';

class UserTrial {
  user!: User;
  trial: boolean = false;
}

@Component({
  selector: 'app-next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
})
export class NextEventComponent implements OnInit {
  @Input() event!: Event;
  participants: UserTrial[] = [];
  date_string: string = '';

  constructor() {
    moment.locale('de');
  }

  ngOnInit() {
    this.date_string = this.getDateString();
    this.getParticipants();
  }

  private getDateString() {
    const date = moment(this.event.date).format('dd. D MMM YYYY / HH:mm');

    if (this.event.time_to) {
      const time_to = moment(this.event.time_to).format('HH:mm');
      return date + '-' + time_to;
    }

    return date + 'Uhr';
  }

  private getParticipants() {
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
}
