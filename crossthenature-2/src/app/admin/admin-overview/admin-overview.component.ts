import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {
  nextEvents: Event[] = [];
  noEvents: Boolean = false;

  constructor(/*private eventService: EventService*/) {}

  ngOnInit() {
    this.noEvents = true;
    /*this.eventService.getAmount(2).subscribe((events) => {
      events.forEach((element) => {
        this.nextEvents.push(element);
      });

      if (!this.nextEvents.length) {
        this.noEvents = true;
      }
    });*/
  }
}
