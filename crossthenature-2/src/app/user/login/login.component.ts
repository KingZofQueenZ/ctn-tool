import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  model: any = {};
  hasError = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.authenticationService.logout();
  }

  login() {
    this.authenticationService
      .login(this.model.email, this.model.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (e) => {
          this.hasError = true;
        },
      });
  }
}
