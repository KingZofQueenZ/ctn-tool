import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Event } from '../../models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  events: Event[] = [];
  noEvents: Boolean = false;

  constructor(
    private userService: UserService) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(): void {
    this.userService.getUserEvents(this.user._id)
      .subscribe(
        events => {
          events.forEach((element) => {
            this.events.push(element);
          });

          if (!this.events.length) {
            this.noEvents = true;
          }
        },
      error => {
        // TODO
      });
  }
}
