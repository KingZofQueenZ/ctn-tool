import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private location: Location,
    private snackBar: MatSnackBar,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser')!);
  }

  update() {
    this.userService.update(this.user!).subscribe({
      next: () => {
        this.snackBar.open('Die Benutzerdaten wurden erfolgreich geändert.');
        this.router.navigate(['/profile']);
      },
      error: (e) => {
        this.snackBar.open('Die Benutzerdaten konnten nicht geändert werden.');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
