import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchOtherValidator } from '../../shared/password.validation';
import { ToasterService } from 'angular2-toaster';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  user: User;
  passwordold: string;
  passwordnew: string;
  passwordconfirm: string;
  success = false;
  passwordForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toasterService: ToasterService) {
      this.passwordForm = fb.group({
        'oldPassword': ['', Validators.required],
        'password': ['', Validators.required],
        'confirmPassword': ['', [matchOtherValidator('password'), Validators.required]],
      });
      this.user = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
  }

  changePassword() {
    this.userService.changepassword({ email: this.user.email, password: this.passwordold, newpassword: this.passwordnew })
      .subscribe(
        result => {
          this.toasterService.pop('success', 'Passwort ändern erfolgreich', 'Das Passwort wurde erfolgreich geändert.');
          this.router.navigate(['/profile']);
        },
        error => {
          this.toasterService.pop('error', 'Passwort ändern fehlgeschlagen', 'Das Passwort konnte nicht geändert werden.');
        }
      );
  }

}
