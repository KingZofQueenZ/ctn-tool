import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  successSnackbar(text: string) {
    this.snackBar.open(text, '', {
      panelClass: ['green-snackbar'],
    });
  }

  errorSnackbar(text: string) {
    this.snackBar.open(text, '', {
      panelClass: ['red-snackbar'],
    });
  }
}
