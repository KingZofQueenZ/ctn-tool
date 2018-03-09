import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ToasterService } from 'angular2-toaster';
import { MzButtonModule } from 'ng2-materialize';
import * as moment from 'moment';
import { Event } from '../../models/event';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-event',
  templateUrl: './delete-event.component.html',
  styleUrls: ['./delete-event.component.scss']
})
export class DeleteEventComponent implements OnInit {
  @Input() event: Event;
  dateString: string;

  constructor(private route: ActivatedRoute, private eventService: EventService,
    private toasterService: ToasterService, private location: Location) {
      moment.locale('de');
    }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getById(id)
      .subscribe(event => {
        this.event = event;
        this.dateString = this.getDateString(event);
      });
  }

  private getDateString(event: Event): string {
    const date = moment(event.date).format('dd. D MMM YYYY / HH:mm');

      if (this.event.time_to) {
        const time_to = moment(event.time_to).format('HH:mm');
        return date + '-' + time_to;
      }

      return date + ' Uhr';
  }

  deleteEvent() {
    this.eventService.delete(this.event._id).subscribe(
      result => {
        this.toasterService.pop('success', 'Löschen erfolgreich', 'Der Termin wurde erfolgreich gelöscht.');
        this.goBack();
      },
      error => {
        this.toasterService.pop('error', 'Löschen fehlerhaft', 'Der Termin konnte nicht gelöscht werden!');
        this.goBack();
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
