import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { MzButtonModule } from 'ng2-materialize';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  nextEvent: Event;
  dateString: string;
  events: Event[] = new Array<Event>();

  constructor(private eventService: EventService) {
    moment.locale('de');
  }

  ngOnInit() {
    this.eventService.getNext().subscribe(event => {
      this.nextEvent = event[0];
      this.dateString = this.getDateString(event[0]);
    });

    this.eventService.getAll(10).subscribe(events => {
      events.forEach((element) => {
        this.events.push(element);
      });
    });
  }

  private getDateString(event: Event): string {
    const date = moment.utc(event.date).format('dd. D MMM YYYY');
    console.log(date);
    if (event.time_from) {
      const time_from = moment.utc(event.time_from).format('HH:mm');

      if (event.time_to) {
        const time_to = moment.utc(event.time_to).format('HH:mm');
        return date + ' / ' + time_from + '-' + time_to;
      }

      return date + ' / ' + time_from + ' Uhr';
    }

    return date;
  }

}
