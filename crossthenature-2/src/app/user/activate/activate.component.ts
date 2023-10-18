import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})
export class ActivateComponent implements OnInit {
  error: Boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private helper: HelperService,
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');

    if (!code) {
      return;
    }

    this.userService.activate(code).subscribe({
      next: () => {
        this.helper.successSnackbar('Dein Benutzer wurde erfolgreich aktiviert! Du kannst dich nun einloggen.');
        this.router.navigate(['/login'], { queryParams: { activated: true } });
      },
      error: () => (this.error = true),
    });
  }
}
