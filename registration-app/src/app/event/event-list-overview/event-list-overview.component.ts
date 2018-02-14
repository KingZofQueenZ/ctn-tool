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
  page = 1;
  dateArray: any[];

  constructor(private eventService: EventService) {
    this.eventService.getDateDict().subscribe(result => {
      this.dateArray = result;
      this.getEvents();
    });
  }

  getEvents(): void {
    this.eventService.getAll(this.page).subscribe(events => {
      events.forEach((element) => {
        this.events.push(element);
      });
    });
  }

  getWidth(event: Event): string {
    const amount = this.dateArray.find(x => x._id === event.date).count;

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
