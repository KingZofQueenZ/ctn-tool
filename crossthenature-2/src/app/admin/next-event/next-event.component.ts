import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { User } from 'src/app/models/user';
import { format } from 'date-fns';

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

  ngOnInit() {
    this.date_string = this.getDateString();
    this.getParticipants();
  }

  private getDateString() {
    const date = format(
      new Date(this.event.date),
      'eeeeee. d MMM yyyy / HH:mm',
    );

    if (this.event.time_to) {
      return date + '-' + format(new Date(this.event.time_to), 'HH:mm');
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
