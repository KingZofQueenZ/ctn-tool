import { Component } from '@angular/core';
import { Event } from '../../models/event';
import { MzInputModule, MzTextareaModule, MzDatepickerModule, MzTimepickerModule, MzCheckboxModule } from 'ng2-materialize';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';


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
    interval: 15
  };
  
  constructor(private eventService: EventService) { }

  create() {
    if(!this.repeat_date){
      this.event.time_to = moment.utc(this.event.date + ' ' + this.event.time_to).toDate();
      this.event.time_from = moment.utc(this.event.date + ' ' + this.event.time_from).toDate();
      this.event.date = moment.utc(this.event.date).toDate();

      this.eventService.create(this.event).subscribe(
        result => {
          console.log('Successful ' + result);
        },
        error => {
          console.log(error);
        }
      )
    } else {
      let event: Event = Object.assign({}, this.event);
      let errorCounter = 0;

      const dates = this.getDates();
      dates.forEach(date => {
        event.date = date.toDate();
        event.time_from = moment.utc(date.format('YYYY-MM-DD') + ' ' + this.event.time_from).toDate();
        event.time_to = moment.utc(date.format('YYYY-MM-DD') + ' ' + this.event.time_to).toDate();

        this.eventService.create(event).subscribe(
          result => {
            console.log('Successfull!: ' + result);
          },
          error => {
            errorCounter++;
          }
        );
      });

      if(errorCounter){
        //Toast error
      }
    }
  }

  private getDates() {
    let dateArray = new Array();
    let date = moment.utc(this.event.date);
    let repeatDays = this.getRepeatDays();

    while(!moment.utc(date).isAfter(moment.utc(this.repeat_date))){
      repeatDays.forEach(weekday => {
        if (moment.utc(date).isoWeekday() <= weekday 
            && !moment.utc(date).isoWeekday(weekday).isAfter(moment.utc(this.repeat_date))){
          dateArray.push(moment.utc(date).isoWeekday(weekday));
        }
      });
      date = moment.utc(date).add(1, 'weeks').startOf('isoWeek');
    }
    return dateArray;
  }

  private getRepeatDays() {
    var repeatArray = new Array();

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
}
