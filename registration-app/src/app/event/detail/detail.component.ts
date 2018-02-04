import { Component, OnInit } from '@angular/core';
import { MzParallaxModule  } from 'ng2-materialize';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MzTabModule } from 'ng2-materialize'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  event: Event;
  user: User;

  constructor(private route: ActivatedRoute, private eventService: EventService) { 
    moment.locale('de');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getEvent();}

  ngOnInit() {
  }

  getEvent() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getById(id).subscribe(event => this.event = event);
  }

}
