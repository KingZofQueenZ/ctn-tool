import { Component } from '@angular/core';
import { MzParallaxModule  } from 'ng2-materialize';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './event-list-overview.component.html',
  styleUrls: ['./event-list-overview.component.scss']
})
export class EventListOverviewComponent {
  events: Event[] = [];
  dateArray: any[] = [];
  page = 1;
  noEvents: Boolean = false;

  constructor(private eventService: EventService) {
    this.getEvents();
  }

  setDateArray(event: Event) {
    const date = this.dateArray.find(x => x.date === moment(event.date).format('YYYY-MM-DD'));

    if (date) {
      this.dateArray.find(x => x.date === moment(event.date).format('YYYY-MM-DD')).count = ++date.count;
    } else {
      this.dateArray.push({ date: moment(event.date).format('YYYY-MM-DD'), count: 1});
    }
  }


  getEvents(): void {
    this.eventService.getAll(this.page).subscribe(events => {
      events.forEach((element) => {
        this.events.push(element);
        this.setDateArray(element);
      });

      if (!this.events.length) {
        this.noEvents = true;
      }

    });
  }

  getWidth(event: Event): string {
    const amount = this.dateArray.find(x => x.date === moment(event.date).format('YYYY-MM-DD')).count;

    switch (amount) {
      case 1:
        return 'l12';
      case 2:
        return 'l6';
      case 3:
        return 'l4';
      default:
        return 'l12';
    }
  }

  onScroll () {
    this.page++;
    this.getEvents();
  }
}
