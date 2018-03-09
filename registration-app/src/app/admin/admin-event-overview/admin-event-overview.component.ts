import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { MzButtonModule } from 'ng2-materialize';
import * as moment from 'moment';
import { SlicePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-admin-event-overview',
  templateUrl: './admin-event-overview.component.html',
  styleUrls: ['./admin-event-overview.component.scss']
})
export class AdminEventOverviewComponent implements OnInit {
  dateString: string;
  noEvents: Boolean = false;
  events: Event[] = [];

  constructor(private eventService: EventService, private toasterService: ToasterService) {
    moment.locale('de');
  }

  ngOnInit() {
    this.getEvents();
  }

  private getDateString(event: Event): string {
    const date = moment(event.date).format('dd. D MMM YYYY / HH:mm');

      if (event.time_to) {
        const time_to = moment(event.time_to).format('HH:mm');
        return date + '-' + time_to;
      }

      return date + ' Uhr';
  }

  private getEvents() {
    this.eventService.getAll().subscribe(events => {
      events.forEach((element) => {
        this.events.push(element);
        this.noEvents = false;
      });

      if (!this.events.length) {
        this.noEvents = true;
      }
    });
  }

  private refresh() {
    this.noEvents = true;
    this.events = [];
    this.getEvents();
  }
}
