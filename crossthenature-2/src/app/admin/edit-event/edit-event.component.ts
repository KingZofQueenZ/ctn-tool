import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../shared/settings';

class UserTrial {
  user!: User;
  trial: boolean = false;
}

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit, OnDestroy {
  @Input() event!: Event;
  time_from: Date | undefined;
  time_to: Date | undefined;

  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  participants: UserTrial[] = [];

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.router.navigate(['/home']);
    }

    this.eventService.getById(id!).subscribe((event: any) => {
      this.event = event;
      this.time_from = this.event.date;
      if (event.time_to) {
        this.time_to = this.event.time_to;
      }

      if (!event.description) {
        this.event.description = '';
      }

      this.getParticipants();
    });
  }

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    moment.locale('de');
    this.editor = new Editor();
  }

  edit() {
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

    if (!event.max_participants) {
      event.max_participants = undefined;
    }

    this.eventService.update(event).subscribe({
      next: () => {
        this.snackBar.open('Der Termin wurde erfolgreich gespeichert.');
        this.goBack();
      },
      error: (e) => {
        this.snackBar.open('Der Termin konnte nicht gespeichert werden.');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  removeUser(participant: UserTrial) {
    this.eventService
      .deleteParticipantAdmin(this.event._id, participant.user._id)
      .subscribe({
        next: () => {
          this.participants.splice(
            this.participants.findIndex(
              (x) => x.user._id === participant.user._id,
            ),
            1,
          );

          this.snackBar.open(
            'Der User wurde erfolgreich von ' + this.event.name + ' entfernt',
          );
        },
        error: (e) => {
          this.snackBar.open('Der User konnte nicht entfernt werden.');
        },
      });
  }

  // Private Methods
  private getParticipants() {
    this.participants = [];

    this.event.participant_ids.forEach((participant) => {
      this.participants.push({ user: participant, trial: false });
    });

    this.event.trial_workouts.forEach((trialParticipant: any) => {
      this.participants.push({
        user: {
          firstname: trialParticipant.firstname,
          lastname: trialParticipant.lastname,
          phone: trialParticipant.phone,
          _id: trialParticipant._id,
          admin: false,
          email: '',
          password: '',
          token: '',
        },
        trial: true,
      });
    });
  }
}
