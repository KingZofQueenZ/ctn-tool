import { Component, HostListener, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { Location } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../shared/settings';
import { differenceInCalendarDays, subDays, eachDayOfInterval, getDay, set } from 'date-fns';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnDestroy {
  event: Event = {} as Event;
  repeat_date: Date | undefined;
  time_from: Date | undefined;
  time_to: Date | undefined;
  weekdays: any[] = [];
  selectedWeekdays: any[] = [];
  touchUI = false;
  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  constructor(
    private eventService: EventService,
    protected location: Location,
    private helper: HelperService,
  ) {
    this.event.description = '';
    this.editor = new Editor();
    this.isTouchUI(window.innerWidth);
    this.weekdays = [
      { name: 'Mo', value: 1 },
      { name: 'Di', value: 2 },
      { name: 'Mi', value: 3 },
      { name: 'Do', value: 4 },
      { name: 'Fr', value: 5 },
      { name: 'Sa', value: 6 },
      { name: 'So', value: 0 },
    ];
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // Add checked day to selected weekdays / remove
  onChecked(selectedValue: any) {
    if (!this.selectedWeekdays.includes(selectedValue)) {
      this.selectedWeekdays.push(selectedValue);
    } else {
      this.selectedWeekdays.splice(this.selectedWeekdays.indexOf(selectedValue), 1);
    }
  }

  create() {
    if (this.repeat_date) {
      this.createMultipleEvents();
    } else {
      this.createSingleEvent();
    }
  }

  private createSingleEvent() {
    const event: Event = Object.assign({}, this.event);

    event.date = set(new Date(event.date), { hours: new Date(this.time_from!).getHours(), minutes: new Date(this.time_from!).getMinutes() });
    event.time_to = set(new Date(event.date), { hours: new Date(this.time_to!).getHours(), minutes: new Date(this.time_to!).getMinutes() });

    this.eventService.create(event).subscribe({
      next: () => {
        this.helper.successSnackbar('Der Termin wurde erfolgreich erstellt.');
        this.location.back();
      },
      error: () => this.helper.errorSnackbar('Der Termin konnte nicht erstellt werden.'),
    });
  }

  private createMultipleEvents() {
    const event: Event = Object.assign({}, this.event);
    const dates = this.getDates();

    let anmeldeDifference = 0;
    let abmeldeDifference = 0;

    if (this.event.sign_in) {
      anmeldeDifference = differenceInCalendarDays(new Date(this.event.date), new Date(this.event.sign_in));
    }

    if (this.event.sign_out) {
      abmeldeDifference = differenceInCalendarDays(new Date(this.event.date), new Date(this.event.sign_out));
    }

    dates.forEach((date) => {
      event.date = set(new Date(date), { hours: new Date(this.time_from!).getHours(), minutes: new Date(this.time_from!).getMinutes() });
      event.time_to = set(new Date(date), { hours: new Date(this.time_to!).getHours(), minutes: new Date(this.time_to!).getMinutes() });

      if (this.event.sign_in) {
        event.sign_in = set(new Date(date), { hours: new Date(this.event.sign_in).getHours(), minutes: new Date(this.event.sign_in).getMinutes() });
        event.sign_in = subDays(new Date(event.sign_in), anmeldeDifference);
      }

      if (this.event.sign_out) {
        event.sign_out = set(new Date(date), { hours: new Date(this.event.sign_out).getHours(), minutes: new Date(this.event.sign_out).getMinutes() });
        event.sign_out = subDays(new Date(event.sign_out), abmeldeDifference);
      }

      this.eventService.create(event).subscribe({
        next: () => {},
        error: () => this.helper.errorSnackbar('Mindestens ein Termin konnte nicht erstellt werden.'),
      });
    });

    this.location.back();
  }

  // Get selected Weekday Dates within provided range
  private getDates() {
    return eachDayOfInterval({
      start: new Date(this.event.date),
      end: new Date(this.repeat_date!),
    }).filter((day) => this.selectedWeekdays.includes(getDay(day)));
  }

  // Display Datepicker as TouchUI if a certain screen width is reached
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isTouchUI(window.innerWidth);
  }

  private isTouchUI(windowWidth: number) {
    this.touchUI = windowWidth < 992;
  }
}
