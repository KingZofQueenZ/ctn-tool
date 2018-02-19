import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToasterService, Toast } from 'angular2-toaster';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
  model: any = {};
  hasError = false;
  success = false; 

  constructor(
    private userService: UserService,
  ) { }

  reset() {
    this.userService.reset(this.model)
      .subscribe(
        result => {
          this.success = true;
        },
        error => {
          this.hasError = true;
          console.log(error);
        });
  }
}
