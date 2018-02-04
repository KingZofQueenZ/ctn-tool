import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss']
})
export class EventListItemComponent implements OnInit {
  @Input() event: Event;
  @Output() handleRegistration = new EventEmitter<Event>();

  constructor() { }

  ngOnInit() {
  }

}
