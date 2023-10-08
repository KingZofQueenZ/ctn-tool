import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import * as moment from 'moment';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list-overview',
  templateUrl: './event-list-overview.component.html',
  styleUrls: ['./event-list-overview.component.scss'],
})
export class EventListOverviewComponent implements OnInit {
  events: Event[] = [];
  dateArray: any[] = [];
  page = 1;
  noEvents: boolean = false;
  loading: boolean = false;
  allEvents: boolean = false;
  probetraining: boolean = false;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
  ) {
    this.getEvents();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const probetraining = params['probetraining'];
      if (probetraining) {
        this.probetraining = true;
      }
    });
  }

  setDateArray(event: Event) {
    const date = this.dateArray.find(
      (x) => x.date === moment(event.date).format('YYYY-MM-DD'),
    );

    if (date) {
      this.dateArray.find(
        (x) => x.date === moment(event.date).format('YYYY-MM-DD'),
      ).count = ++date.count;
    } else {
      this.dateArray.push({
        date: moment(event.date).format('YYYY-MM-DD'),
        count: 1,
      });
    }
  }

  getEvents(): void {
    this.loading = true;
    this.eventService.getAll(this.page).subscribe((events) => {
      events.forEach((element) => {
        this.events.push(element);
        this.setDateArray(element);
      });

      if (!this.events.length) {
        this.noEvents = true;
      }

      if (events.length < 40) {
        this.allEvents = true;
      }

      this.loading = false;
    });
  }

  getWidth(event: Event): string {
    const amount = this.dateArray.find(
      (x) => x.date === moment(event.date).format('YYYY-MM-DD'),
    ).count;

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

  public load() {
    this.page++;
    this.getEvents();
  }
}
