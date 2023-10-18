import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { Location } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../shared/settings';
import { set } from 'date-fns';
import { User } from 'src/app/models/user';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit, OnDestroy {
  event!: Event;
  time_from: Date | undefined;
  time_to: Date | undefined;
  touchUI = false;
  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    protected location: Location,
    private router: Router,
    private helper: HelperService,
  ) {
    this.editor = new Editor();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/home']);
      return;
    }

    this.eventService.getById(id).subscribe((event: any) => {
      this.event = event;
      this.time_from = this.event.date;
      this.time_to = this.event.time_to;

      this.helper.combineTrialParticipants(this.event);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  edit() {
    const event: Event = Object.assign({}, this.event);
    event.date = set(new Date(event.date), { hours: new Date(this.time_from!).getHours(), minutes: new Date(this.time_from!).getMinutes() });
    event.time_to = set(new Date(event.date), { hours: new Date(this.time_to!).getHours(), minutes: new Date(this.time_to!).getMinutes() });

    this.eventService.update(event).subscribe({
      next: () => {
        this.helper.successSnackbar('Der Termin wurde erfolgreich gespeichert.');
        this.location.back();
      },
      error: () => this.helper.errorSnackbar('Der Termin konnte nicht gespeichert werden.'),
    });
  }

  removeUser(participant: User) {
    this.eventService.deleteParticipantAdmin(this.event._id, participant._id).subscribe({
      next: () => {
        this.helper.removeParticipantFromArray(this.event, participant._id);
        this.helper.successSnackbar('Der User wurde erfolgreich von ' + this.event.name + ' entfernt');
      },
      error: () => this.helper.errorSnackbar('Der User konnte nicht entfernt werden.'),
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
