import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'delete-user-dialog',
  templateUrl: 'delete-user-dialog.component.html',
})
export class DeleteUserDialog {
  firstname: string;
  lastname: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
  }
}
