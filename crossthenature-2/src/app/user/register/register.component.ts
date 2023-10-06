import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { matchOtherValidator } from 'src/app/shared/password.validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: User = new User();
  passwordconfirm: string | undefined;
  hasError = false;
  success = false;
  registerForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private userService: UserService,
  ) {
    this.registerForm = fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      token: ['', Validators.required],
      confirmPassword: [
        '',
        [matchOtherValidator('password'), Validators.required],
      ],
    });
  }

  register(): void {
    this.userService.create(this.user).subscribe({
      next: () => {
        this.success = true;
      },
      error: (e) => {
        this.hasError = true;
      },
    });
  }
}
