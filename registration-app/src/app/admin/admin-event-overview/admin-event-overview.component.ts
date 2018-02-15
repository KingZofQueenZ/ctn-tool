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
  delEvent: Event;
  delEventDateString: string;
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
    const date = moment.utc(event.date).format('dd. D MMM YYYY');

      if (event.time_to) {
        const time_to = moment.utc(event.time_to).format('HH:mm');
        return date + '-' + time_to;
      }

      return date + ' / ' + ' Uhr';
  }

  setEventToDelete(event: Event) {
    this.delEvent = event;
    this.delEventDateString = this.getDateString(event);
  }

  deleteEvent() {
    this.eventService.delete(this.delEvent._id).subscribe(
      result => {
        this.toasterService.pop('success', 'Löschen erfolgreich', 'Der Termin wurde erfolgreich gelöscht.');
        this.refresh();
      },
      error => {
        this.toasterService.pop('error', 'Löschen fehlerhaft', 'Der Termin konnte nicht gelöscht werden!');
      }
    );
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
