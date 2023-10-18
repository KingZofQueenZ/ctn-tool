import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { User } from 'src/app/models/user';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-list-overview',
  templateUrl: './event-list-overview.component.html',
  styleUrls: ['./event-list-overview.component.scss'],
})
export class EventListOverviewComponent implements OnInit {
  events: Event[] = [];
  user: User | undefined;
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
    const storageUser = localStorage.getItem('currentUser');
    if (storageUser) {
      this.user = JSON.parse(storageUser);
    }

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
      (x) => x.date === format(new Date(event.date), 'yyyy-MM-dd'),
    );

    if (date) {
      this.dateArray.find(
        (x) => x.date === format(new Date(event.date), 'yyyy-MM-dd'),
      ).count = ++date.count;
    } else {
      this.dateArray.push({
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        count: 1,
      });
    }
  }

  getEvents(): void {
    this.loading = true;

    if (this.user) {
      this.eventService.getAll(this.page).subscribe((events) => {
        events.forEach((element) => {
          this.events.push(element);
          this.setDateArray(element);
        });
        this.setEventVariables();
      });
    } else {
      this.eventService.getAllPublic(this.page).subscribe((events) => {
        events.forEach((element) => {
          this.events.push(element);
          this.setDateArray(element);
        });
        this.setEventVariables();
      });
    }
  }

  getWidth(event: Event): string {
    const amount = this.dateArray.find(
      (x) => x.date === format(new Date(event.date), 'yyyy-MM-dd'),
    ).count;

    switch (amount) {
      case 1:
        return 'lg-12';
      case 2:
        return 'lg-6';
      case 3:
        return 'lg-4';
      default:
        return 'lg-12';
    }
  }

  public load() {
    this.page++;
    this.getEvents();
  }

  private setEventVariables() {
    if (!this.events.length) {
      this.noEvents = true;
    }

    if (this.events.length < 40) {
      this.allEvents = true;
    }

    this.loading = false;
  }
}
