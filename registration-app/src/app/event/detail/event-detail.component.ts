import { Component, Input, AfterViewChecked } from '@angular/core';
import { MzParallaxModule, MzSpinnerModule, MzButtonModule } from 'ng2-materialize';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements AfterViewChecked {
  event: Event;
  user: User;
  date_string: string;
  is_registered: Boolean;

  constructor(private route: ActivatedRoute, private eventService: EventService) {
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
      console.log(event);
      $('ul.tabs').tabs();
    });
  }
  
  private checkIfRegistered(event: Event): Boolean {
    let val = false;

    event.participant_ids.forEach(element => {
      if (this.user && element._id === this.user._id) {
        console.log(true, event);
        val = true;
      }
    });
    return val;
  }
  
  private setDateString(event: Event): string {
    const date = moment(event.date).utc().format('dddd, D MMMM YYYY');
    
    if (event.time_from) {
      const time_from = moment(event.time_from).utc().format('HH:mm');

      if (event.time_to) {
        const time_to = moment(event.time_to).utc().format('HH:mm');
        return date + ' / ' + time_from + '-' + time_to;
      }

      return date + ' / ' + time_from + ' Uhr';
    }

    return date;
  }

  handleRegistration(): void {
    if (this.is_registered) {
      this.eventService.deleteParticipant(this.event._id, this.user._id).subscribe(
        result => {
          const index = this.event.participant_ids.indexOf(this.user._id);
          this.event.participant_ids.splice(index, 1);
          this.is_registered = false;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.eventService.addParticipant(this.event._id, this.user).subscribe(
        result => {
          this.event.participant_ids.push({ _id: this.user._id, firstname: this.user.firstname, lastname: this.user.lastname });
          this.is_registered = true;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
