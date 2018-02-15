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

  constructor() { }

  ngOnInit() {
    this.date_string = this.getDateString();
  }

  private getDateString() {
    const date = moment.utc(this.event.date).format('dd. D MMM YYYY / HH:mm');

      if (this.event.time_to) {
        const time_to = moment.utc(this.event.time_to).format('HH:mm');
        return date + '-' + time_to;
      }

      return date + 'Uhr';
  }
}
