import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = new User;
  emailFocus = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  register(): void {
    console.log(this.user);
    this.userService.create(this.user)
      .subscribe(
        data => {
          console.log('Registered successfully');
          this.router.navigate(['/login']);
        });
  }
}
