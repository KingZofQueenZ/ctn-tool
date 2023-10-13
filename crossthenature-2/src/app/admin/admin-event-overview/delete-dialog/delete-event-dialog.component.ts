import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'delete-event-dialog',
  templateUrl: 'delete-event-dialog.component.html',
})
export class DeleteEventDialog {
  dateString: string;
  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.dateString = data.dateString;
    this.name = data.name;
  }
}
