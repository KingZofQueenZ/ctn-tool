import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MzInputModule, MzCheckboxModule, MzModalModule } from 'ng2-materialize';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = new User;
  hasError = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  register(): void {
    this.userService.create(this.user)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          this.hasError = true;
          console.log(error);
        },
        () => {
          this.router.navigate(['/login']);
        });
  }
}
