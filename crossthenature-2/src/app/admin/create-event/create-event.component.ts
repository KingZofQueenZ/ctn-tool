import { Component, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../shared/settings';
import {
  differenceInDays,
  subDays,
  isWithinInterval,
  eachWeekOfInterval,
} from 'date-fns';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnDestroy {
  event: Event = new Event();
  mo: boolean = false;
  di: boolean = false;
  mi: boolean = false;
  do: boolean = false;
  fr: boolean = false;
  sa: boolean = false;
  so: boolean = false;
  repeat_date: Date | undefined;
  time_from: Date | undefined;
  time_to: Date | undefined;

  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  constructor(
    private eventService: EventService,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {
    this.editor = new Editor();
  }

  create() {
    if (!this.repeat_date) {
      this.createSingleEvent();
    } else {
      this.createMultipleEvents();
    }
  }

  private createSingleEvent() {
    const event: Event = Object.assign({}, this.event);
    const eventDate = new Date(event.date);
    const timeFrom = new Date(this.time_from!);

    event.date = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      timeFrom.getHours(),
      timeFrom.getMinutes(),
    );

    if (this.time_to) {
      const timeTo = new Date(this.time_to!);

      event.time_to = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        timeTo.getHours(),
        timeTo.getMinutes(),
      );
    } else {
      event.time_to = undefined;
    }

    this.eventService.create(event).subscribe({
      next: () => {
        this.snackBar.open('Der Termin wurde erfolgreich erstellt.', '', {
          panelClass: ['green-snackbar'],
        });
        this.goBack();
      },
      error: (e) => {
        this.snackBar.open('Der Termin konnte nicht erstellt werden.', '', {
          panelClass: ['red-snackbar'],
        });
      },
    });
  }

  private createMultipleEvents() {
    const event: Event = Object.assign({}, this.event);
    const dates = this.getDates();

    const anmeldeDifference = 0;
    const abmeldeDifference = 0;

    if (this.event.sign_in) {
      differenceInDays(new Date(this.event.date), new Date(this.event.sign_in));
    }

    if (this.event.sign_out) {
      differenceInDays(
        new Date(this.event.date),
        new Date(this.event.sign_out),
      );
    }

    dates.forEach((date) => {
      const eventDate = new Date(date);
      const timeFrom = new Date(this.time_from!);

      event.date = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        timeFrom.getHours(),
        timeFrom.getMinutes(),
      );

      if (this.time_to) {
        const timeTo = new Date(this.time_to!);

        event.time_to = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
          timeTo.getHours(),
          timeTo.getMinutes(),
        );
      } else {
        event.time_to = undefined;
      }

      if (this.event.sign_in) {
        const signIn = new Date(this.event.sign_in);
        event.sign_in = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
          signIn.getHours(),
          signIn.getMinutes(),
        );

        event.sign_in = subDays(new Date(event.sign_in), anmeldeDifference);
      }
      if (this.event.sign_out) {
        const signOut = new Date(this.event.sign_out);
        event.sign_out = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
          signOut.getHours(),
          signOut.getMinutes(),
        );
        event.sign_in = subDays(new Date(event.sign_out), abmeldeDifference);
      }

      this.eventService.create(event).subscribe({
        next: () => {},
        error: (e) => {
          this.snackBar.open(
            'Mindestens ein Termin konnte nicht erstellt werden.',
            '',
            {
              panelClass: ['red-snackbar'],
            },
          );
        },
      });
    });

    this.goBack();
  }

  private getDates() {
    const dateArray = new Array();
    const repeatDays = this.getRepeatDays();

    repeatDays.forEach((weekday) => {
      var weekdayDates = eachWeekOfInterval(
        {
          start: new Date(this.event.date),
          end: new Date(this.repeat_date!),
        },
        { weekStartsOn: weekday },
      );

      weekdayDates.forEach((date) => {
        if (
          isWithinInterval(date, {
            start: new Date(this.event.date),
            end: new Date(this.repeat_date!),
          })
        ) {
          dateArray.push(date);
        }
      });
    });

    return dateArray;
  }

  private getRepeatDays() {
    const repeatArray = new Array();

    if (this.mo) {
      repeatArray.push(1);
    }

    if (this.di) {
      repeatArray.push(2);
    }

    if (this.mi) {
      repeatArray.push(3);
    }

    if (this.do) {
      repeatArray.push(4);
    }

    if (this.fr) {
      repeatArray.push(5);
    }

    if (this.sa) {
      repeatArray.push(6);
    }

    if (this.so) {
      repeatArray.push(7);
    }

    return repeatArray;
  }

  goBack(): void {
    this.location.back();
  }
}
