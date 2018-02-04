import { Component, Input, AfterViewChecked } from '@angular/core';
import { MzParallaxModule, MzSpinnerModule, MzButtonModule } from 'ng2-materialize';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements AfterViewChecked {
  event: Event;
  user: User;
  date_string: string;
  is_registered: Boolean;

  constructor(private route: ActivatedRoute, private eventService: EventService) { 
    moment.locale('de');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getEvent();
    $('ul.tabs').tabs();
  }

  ngAfterViewChecked(): void {
    $('ul.tabs').tabs();
  }

  getEvent() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getById(id).subscribe(event => {
      this.date_string = this.setDateString(event);
      this.is_registered = this.checkIfRegistered(event);
      this.event = event;
      $('ul.tabs').tabs();
    });
  }
  
  private checkIfRegistered(event: Event): Boolean {
    let val = false;

    event.participant_ids.forEach(element => {
      if (element._id === this.user._id) {
        console.log(true, event);
        val = true;
      }
    });
    return val;
  }
  
  private setDateString(event: Event): string {
    const date = moment(event.date).utc().format('dddd, D MMMM YYYY / HH:mm');
    const time_to = moment(event.time_to).utc().format('HH:mm');
    return date + ' bis ' + time_to;
  }

}
