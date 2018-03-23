import { Component } from '@angular/core';
import { Event } from '../../models/event';
import { MzInputModule, MzTextareaModule, MzDatepickerModule, MzTimepickerModule, MzCheckboxModule } from 'ng2-materialize';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {
  event: Event = new Event();
  mo: Boolean;
  di: Boolean;
  mi: Boolean;
  do: Boolean;
  fr: Boolean;
  sa: Boolean;
  so: Boolean;
  repeat_date: Date;
  datum_anmeldefrist: string;
  time_anmeldefrist: string;
  datum_abmeldefrist: string;
  time_abmeldefrist: string;
  time_from: string;
  ckeConfig = {
    toolbar: [
      { name: 'document', items: [ 'Source' ] },
			{ name: 'clipboard', items: [ 'Undo', 'Redo' ] },
			{ name: 'styles', items: [ 'Format', 'FontSize' ] },
      { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
			{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'CopyFormatting' ] },
			{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'Blockquote' ] },
			{ name: 'links', items: [ 'Link', 'Unlink' ] },
			{ name: 'insert', items: [ 'Image', 'EmbedSemantic', 'Table', 'HorizontalRule', 'Smiley' ] },
			{ name: 'tools', items: [ 'Maximize' ] }
    ],
    removeDialogTabs: 'image:advanced;link:advanced',
    extraPlugins: 'divarea',
    height: 350
  };

  public optionsDate: Pickadate.DateOptions = {
    format: 'dddd, dd mmm. yyyy',
    formatSubmit: 'yyyy-mm-dd',
    monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'],
    weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today: 'Heute',
    clear: 'Löschen',
    close: 'Schliessen',
    min: true,
    closeOnSelect: true,
    closeOnClear: true,
    showMonthsShort: true,
  };

  public optionsTime: Pickadate.TimeOptions = {
    format: 'HH:i',
    default: 'now',
    fromnow: 0,
    twelvehour: false,
    donetext: 'OK',
    cleartext: 'Löschen',
    canceltext: 'Abbrechen',
    autoclose: true,
    interval: 150
  };

  constructor(private eventService: EventService, private location: Location, private toasterService: ToasterService) { 
    moment.locale('de');
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

    event.date = moment(this.event.date + 'T' + this.time_from).toDate();
    if (this.event.time_to) { event.time_to = moment(this.event.date + 'T' + this.event.time_to).toDate(); }
    if (this.datum_anmeldefrist && this.time_anmeldefrist) { event.sign_in = moment(this.datum_anmeldefrist + 'T' + this.time_anmeldefrist).toDate(); }
    if (this.datum_abmeldefrist && this.time_abmeldefrist) { event.sign_out = moment(this.datum_abmeldefrist + 'T' + this.time_abmeldefrist).toDate(); }

    this.eventService.create(event).subscribe(
      result => {
        this.toasterService.pop('success', 'Erstellen erfolgreich', 'Der Termin wurde erfolgreich erstellt.');
        this.goBack();
      },
      error => {
        this.toasterService.pop('error', 'Erstellen nicht erfolgreich', 'Der Termin konnte nicht erstellt werden.');
      }
    );
  }

  private createMultipleEvents() {
    const event: Event = Object.assign({}, this.event);
    const dates = this.getDates();

    const anmeldeDifference = moment(this.event.date).diff(moment(this.datum_anmeldefrist), 'days');
    const abmeldeDifference = moment(this.event.date).diff(moment(this.datum_abmeldefrist), 'days');

    dates.forEach(date => {
      event.date = moment(date.format('YYYY-MM-DD') + 'T' + this.time_from).toDate();
      if (this.event.time_to) { event.time_to = moment(date.format('YYYY-MM-DD') + 'T' + this.event.time_to).toDate(); }
      if (this.datum_anmeldefrist && this.time_anmeldefrist) { event.sign_in = moment(date.format('YYYY-MM-DD') + 'T' + this.time_anmeldefrist).subtract(anmeldeDifference, 'days').toDate(); }
      if (this.datum_abmeldefrist && this.time_abmeldefrist) { event.sign_out = moment(date.format('YYYY-MM-DD') + 'T' + this.time_abmeldefrist).subtract(abmeldeDifference, 'days').toDate(); }

      this.eventService.create(event).subscribe(
        result => {
          // TODO
          console.log('Successfull!: ' + result);
        },
        error => {
          this.toasterService.pop('error', 'Erstellen nicht erfolgreich', 'Mindestens ein Termin konnte nicht erstellt werden.');
        }
      );
    });

    this.goBack();
  }

  private getDates() {
    const dateArray = new Array();
    const repeatDays = this.getRepeatDays();
    let date = moment(this.event.date);

    while (!moment(date).isAfter(moment(this.repeat_date))) {
      repeatDays.forEach(weekday => {
        if (moment(date).isoWeekday() <= weekday
            && !moment(date).isoWeekday(weekday).isAfter(moment(this.repeat_date))) {
          dateArray.push(moment(date).isoWeekday(weekday));
        }
      });
      date = moment(date).add(1, 'weeks').startOf('isoWeek');
    }
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
