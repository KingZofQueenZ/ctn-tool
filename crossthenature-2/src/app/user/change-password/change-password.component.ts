import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { matchOtherValidator } from 'src/app/shared/password.validation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  user!: User;
  passwordForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private location: Location,
    private snackBar: MatSnackBar,
    fb: FormBuilder,
  ) {
    this.passwordForm = fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [
        '',
        [matchOtherValidator('password'), Validators.required],
      ],
    });
    this.user = JSON.parse(localStorage.getItem('currentUser')!);
  }

  changePassword() {
    this.userService
      .changepassword({
        email: this.user.email,
        password: this.passwordForm.controls['oldPassword'].value,
        newpassword: this.passwordForm.controls['password'].value,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Das Passwort wurde erfolgreich geändert.');
          this.router.navigate(['/profile']);
        },
        error: (e) => {
          this.snackBar.open('Das Passwort konnte nicht geändert werden.');
        },
      });
  }

  goBack(): void {
    this.location.back();
  }
}
