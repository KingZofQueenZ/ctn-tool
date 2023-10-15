import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteEventDialog } from './delete-dialog/delete-event-dialog.component';

@Component({
  selector: 'app-admin-event-overview',
  templateUrl: './admin-event-overview.component.html',
  styleUrls: ['./admin-event-overview.component.scss'],
})
export class AdminEventOverviewComponent implements OnInit {
  dateString: string = '';
  noEvents: Boolean = false;
  events: Event[] = [];
  page = 1;
  loading: Boolean = false;
  allEvents: Boolean = false;

  constructor(
    private eventService: EventService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    moment.locale('de');
  }

  ngOnInit() {
    this.getEvents();
  }

  public getDateString(event: Event): string {
    const date = moment(event.date).format('dd. D MMM YYYY / HH:mm');

    if (event.time_to) {
      const time_to = moment(event.time_to).format('HH:mm');
      return date + '-' + time_to;
    }

    return date + ' Uhr';
  }

  private getEvents() {
    this.loading = true;
    setTimeout(() => {
      this.eventService.getAll(this.page).subscribe((events) => {
        if (events.length === 0) {
          this.noEvents = true;
          this.page = 1;
        }

        this.events = [];
        events.forEach((element) => {
          this.events.push(element);
          this.noEvents = false;
        });

        if (!this.events.length) {
          this.noEvents = true;
        }

        if (events.length < 40) {
          this.allEvents = true;
        }

        this.loading = false;
      });
    }, 500);
  }

  public load() {
    this.page++;
    this.getEvents();
  }

  deleteEvent(event: Event) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      dateString: this.getDateString(event),
      name: event.name,
    };
    const dialogRef = this.dialog.open(DeleteEventDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.delete(event._id).subscribe({
          next: () => {
            this.snackBar.open('Der Termin wurde erfolgreich gelöscht.', '', {
              panelClass: ['green-snackbar'],
            });
            this.getEvents();
          },
          error: (e) => {
            this.snackBar.open('Der Termin konnte nicht gelöscht werden.', '', {
              panelClass: ['red-snackbar'],
            });
          },
        });
      }
    });
  }
}
