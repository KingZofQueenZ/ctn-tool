import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  model: any = {};
  hasError = false;
  success = false;

  constructor(private userService: UserService) {}

  reset() {
    this.userService.reset(this.model).subscribe({
      next: () => (this.success = true),
      error: () => (this.hasError = true),
    });
  }
}
