import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.component.html',
})
export class DeleteDialog {
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.title = data.title;
  }
}
