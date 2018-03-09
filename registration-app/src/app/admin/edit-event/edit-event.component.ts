import { Component, Input, OnInit} from '@angular/core';
import { Event } from '../../models/event';
import { MzInputModule, MzTextareaModule, MzDatepickerModule, MzTimepickerModule, MzCheckboxModule } from 'ng2-materialize';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  @Input() event: any;
  datum_anmeldefrist: string;
  time_anmeldefrist: string;
  datum_abmeldefrist: string;
  time_abmeldefrist: string;
  time_from: string;
  time_to: string;

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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getById(id)
      .subscribe(event => {
        this.event = event;
        this.time_from = moment(this.event.date).format('HH:mm');
        this.event.date = moment(this.event.date).format('YYYY-MM-DD');

        if (event.time_to) { this.time_to = moment(this.event.time_to).format('HH:mm'); }
        if (event.sign_in) { this.datum_anmeldefrist = moment(this.event.sign_in).format('YYYY-MM-DD'); }
        if (event.sign_in) { this.time_anmeldefrist = moment(this.event.sign_in).format('HH:mm'); }
        if (event.sign_out) { this.datum_abmeldefrist = moment(this.event.sign_out).format('YYYY-MM-DD'); }
        if (event.sign_out) { this.time_abmeldefrist = moment(this.event.sign_out).format('HH:mm'); }
      });
  }

  constructor(private route: ActivatedRoute, private eventService: EventService,
    private location: Location, private toasterService: ToasterService) {
    moment.locale('de');
  }

  edit() {
    const event: Event = Object.assign({}, this.event);
    event.date = moment(this.event.date + 'T' + this.time_from).toDate();

    if (this.time_to) {
      event.time_to = moment(this.event.date + 'T' + this.time_to).toDate();
    }

    if (this.datum_anmeldefrist && this.time_anmeldefrist) {
      event.sign_in = moment(this.datum_anmeldefrist + 'T' + this.time_anmeldefrist).toDate();
    }

    if (this.datum_abmeldefrist && this.time_abmeldefrist) {
      event.sign_out = moment(this.datum_abmeldefrist + 'T' + this.time_abmeldefrist).toDate();
    }

    this.eventService.update(event).subscribe(
      result => {
        this.toasterService.pop('success', 'Editieren erfolgreich', 'Der Termin wurde erfolgreich gespeichert.');
        this.goBack();
      },
      error => {
        this.toasterService.pop('error', 'Editieren nicht erfolgreich', 'Der Termin konnte nicht gespeichert werden.');
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
