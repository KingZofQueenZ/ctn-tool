import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../shared/settings';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { set } from 'date-fns';

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

  touchUI = false;

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
    protected location: Location,
    private router: Router,
    private snackbar: SnackbarService,
  ) {
    this.editor = new Editor();
  }

  edit() {
    const event: Event = Object.assign({}, this.event);

    event.date = set(new Date(event.date), { hours: new Date(this.time_from!).getHours(), minutes: new Date(this.time_from!).getMinutes() });
    event.time_to = set(new Date(event.date), { hours: new Date(this.time_to!).getHours(), minutes: new Date(this.time_to!).getMinutes() });

    this.eventService.update(event).subscribe({
      next: () => {
        this.snackbar.successSnackbar('Der Termin wurde erfolgreich gespeichert.');
        this.location.back();
      },
      error: () => this.snackbar.errorSnackbar('Der Termin konnte nicht gespeichert werden.'),
    });
  }

  removeUser(participant: UserTrial) {
    this.eventService.deleteParticipantAdmin(this.event._id, participant.user._id).subscribe({
      next: () => {
        this.participants.splice(
          this.participants.findIndex((x) => x.user._id === participant.user._id),
          1,
        );

        this.snackbar.successSnackbar('Der User wurde erfolgreich von ' + this.event.name + ' entfernt');
      },
      error: () => this.snackbar.errorSnackbar('Der User konnte nicht entfernt werden.'),
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

  // Display Datepicker as TouchUI if a certain screen width is reached
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isTouchUI(window.innerWidth);
  }

  private isTouchUI(windowWidth: number) {
    this.touchUI = windowWidth < 992;
  }
}
