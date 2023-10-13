import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {
  nextEvents: Event[] = [];
  noEvents: boolean = false;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getAmount(2).subscribe((events) => {
      events.forEach((element) => {
        this.nextEvents.push(element);
      });

      if (!events.length) {
        this.noEvents = true;
      }
    });
  }
}
