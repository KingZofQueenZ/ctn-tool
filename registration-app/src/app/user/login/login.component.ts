import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToasterService, Toast } from 'angular2-toaster';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  hasError = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.authenticationService.logout();

    const activated = this.activatedRoute.snapshot.queryParams['activated'];
    if (activated) {
      this.toasterService.pop('success', 'Aktivierung erfolgreich',
        'Dein Benutzer wurde erfolgreich aktiviert! Du kannst dich nun einloggen.');
    }
  }

  login() {
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        result => {
          console.log('login success');
        },
        error => {
          this.hasError = true;
        },
        () => {
          this.router.navigate(['/events']);
        }
      );
  }
}
