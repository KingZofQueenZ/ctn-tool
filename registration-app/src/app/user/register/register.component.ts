import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MzInputModule, MzCheckboxModule, MzModalModule } from 'ng2-materialize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchOtherValidator } from '../../shared/password.validation';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = new User;
  passwordconfirm: string;
  hasError = false;
  success = false;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toasterService: ToasterService) {
      this.registerForm = fb.group({
        'firstname': ['', Validators.required],
        'lastname': ['', Validators.required],
        'email': ['', [Validators.required, Validators.email]],
        'phone': ['', Validators.required],
        'password': ['', Validators.required],
        'confirmPassword': ['', [matchOtherValidator('password'), Validators.required]],
        'confirm': ['', Validators.required],
      });
    }

  register(): void {
    this.userService.create(this.user)
      .subscribe(
        result => {
          this.success = true;
        },
        error => {
          this.hasError = true;
        });
  }
}
