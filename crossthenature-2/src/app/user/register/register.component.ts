import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { matchOtherValidator } from 'src/app/shared/password.validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = new User;
  passwordconfirm: string | undefined;
  hasError = false;
  success = false;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,) {
      this.registerForm = fb.group({
        'firstname': ['', Validators.required],
        'lastname': ['', Validators.required],
        'email': ['', [Validators.required, Validators.email]],
        'phone': ['', Validators.required],
        'password': ['', Validators.required],
        'confirmPassword': ['', [matchOtherValidator('password'), Validators.required]],
      });
    }

  register(): void {
    /*this.userService.create(this.user)
      .subscribe(
        result => {
          this.success = true;
        },
        error => {
          this.hasError = true;
        });*/
  }

}
