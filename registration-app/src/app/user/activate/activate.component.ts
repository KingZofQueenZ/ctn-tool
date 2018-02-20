import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MzButtonModule } from 'ng2-materialize';
import { ToasterService } from 'angular2-toaster/src/toaster.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  error: Boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private toasterService: ToasterService) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');

    this.userService.activate(code).subscribe(
      result => {
        this.toasterService.pop('success', 'Aktivierung erfolgreich',
          'Dein Benutzer wurde erfolgreich aktiviert! Du kannst dich nun einloggen.');

        this.router.navigate(['/login'], { queryParams: { activated : true}});
      },
      error => {
        this.error = true;
      });
  }
}
