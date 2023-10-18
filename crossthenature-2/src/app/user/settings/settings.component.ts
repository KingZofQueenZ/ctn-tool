import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    protected location: Location,
    private helper: HelperService,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser')!);
  }

  update() {
    this.userService.update(this.user!).subscribe({
      next: () => {
        this.helper.successSnackbar('Die Benutzerdaten wurden erfolgreich geändert.');
        this.router.navigate(['/profile']);
      },
      error: () => this.helper.errorSnackbar('Die Benutzerdaten konnten nicht geändert werden.'),
    });
  }
}
