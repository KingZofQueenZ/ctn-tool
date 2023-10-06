import { Component } from '@angular/core';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditorConfig } from '@ckeditor/ckeditor5-core';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss'],
})
export class CreateNewsComponent {
  news: News = new News();
  editor = ClassicEditor;

  ckeConfig: EditorConfig = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontfamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'subscript',
      'superscript',
      'code',
      '-', // break point
      '|',
      'alignment',
      'link',
      'uploadImage',
      'blockQuote',
      'codeBlock',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      'outdent',
      'indent',
    ],
  };

  constructor(
    private newsService: NewsService,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {}

  create() {
    this.newsService.create(this.news).subscribe({
      next: () => {
        this.snackBar.open('Die News wurde erfolgreich erstellt.');
        this.goBack();
      },
      error: (e) => {
        this.snackBar.open('Die News konnte nicht erstellt werden.');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
