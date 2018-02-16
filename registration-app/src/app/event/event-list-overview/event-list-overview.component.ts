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

  getDates() {
    this.dateArray = [];

    this.events.forEach((event) => {
      const entry = this.dateArray.find(x => x.date === moment(event.date).format('YYYY-MM-DD'));

      if (entry) {
        entry.count = entry.count++;
      } else {
        this.dateArray.push({ date: moment(event.date).format('YYYY-MM-DD'), count: 1});
      }
    });

    console.log(this.dateArray);
  }


  getEvents(): void {
    this.eventService.getAll(this.page).subscribe(events => {
      events.forEach((element) => {
        this.events.push(element);
      });

      if (!this.events.length) {
        this.noEvents = true;
      }

      this.getDates();
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
