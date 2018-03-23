import { Component } from '@angular/core';
import { MzInputModule, MzTextareaModule } from 'ng2-materialize';
import { UserService } from '../../services/user.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  model: any = {};
  success: Boolean = false;

  constructor(
    private userService: UserService,
    private toasterService: ToasterService) { }

  send() {
    this.userService.contact(this.model)
      .subscribe(
        result => {
          this.success = true;
          this.toasterService.pop('success', 'Kontaktformular', 'Das Kontaktformular wurde gesendet.');
        },
        error => {
          this.toasterService.pop('error', 'Kontaktformular', 'Das Kontaktformular konnte nicht gesendet werden!');
        }
      );
  }

}
