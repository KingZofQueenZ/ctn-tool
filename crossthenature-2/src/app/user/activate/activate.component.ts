import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');

    if (!code) {
      return;
    }

    this.userService.activate(code).subscribe({
      next: () => {
        this.snackBar.open(
          'Dein Benutzer wurde erfolgreich aktiviert! Du kannst dich nun einloggen.',
          '',
          {
            panelClass: ['green-snackbar'],
          },
        );

        this.router.navigate(['/login'], { queryParams: { activated: true } });
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
