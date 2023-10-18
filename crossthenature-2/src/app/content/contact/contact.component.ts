import { Component } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  model: any = {};
  success: Boolean = false;

  constructor(
    private userService: UserService,
    private helper: HelperService,
  ) {}

  send() {
    this.userService.contact(this.model).subscribe({
      next: () => {
        this.success = true;
        this.helper.successSnackbar('Das Kontaktformular wurde gesendet.');
      },
      error: () => this.helper.errorSnackbar('Das Kontaktformular konnte nicht gesendet werden!'),
    });
  }
}
