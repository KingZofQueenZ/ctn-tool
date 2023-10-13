import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'delete-news-dialog',
  templateUrl: 'delete-news-dialog.component.html',
})
export class DeleteNewsDialog {
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.title = data.title;
  }
}
