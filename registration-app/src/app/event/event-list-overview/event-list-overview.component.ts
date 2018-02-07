import { Component } from '@angular/core';
import { MzParallaxModule  } from 'ng2-materialize';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-overview',
  templateUrl: './event-list-overview.component.html',
  styleUrls: ['./event-list-overview.component.scss']
})
export class EventListOverviewComponent {
  events: Event[] = [];
  page = 1;

  constructor(private eventService: EventService) {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getAll(this.page).subscribe(events => {
      events.forEach((element) => {
        this.events.push(element);
      });
    });
  }

  onScroll () {
    this.page++;
    console.log('scrolled!!', this.page);
    this.getEvents();
  }
}
