import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
})
export class NextEventComponent implements OnInit {
  @Input() event!: Event;

  constructor(private helper: HelperService) {}

  ngOnInit() {
    this.helper.combineTrialParticipants(this.event);
  }
}
