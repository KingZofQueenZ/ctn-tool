import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: User;
  events: Event[] = [];
  noEvents: Boolean = false;

  constructor(private userService: UserService) {
    const storageUser = localStorage.getItem('currentUser');

    if (storageUser) {
      this.user = JSON.parse(storageUser);
    }
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(): void {
    this.userService.getUserEvents(this.user._id).subscribe({
      next: (events: Event[]) => {
        events.forEach((element: Event) => {
          this.events.push(element);
        });

        if (!this.events.length) {
          this.noEvents = true;
        }
      },
      error: (e) => {},
    });
  }
}
