import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { News } from 'src/app/models/news';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditorConfig } from '@ckeditor/ckeditor5-core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss'],
})
export class EditNewsComponent {
  @Input() news!: News;
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
    private route: ActivatedRoute,
    private newsService: NewsService,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.newsService.getById(id!).subscribe({
      next: (news) => {
        this.news = news;
      },
      error: (e) => {
        this.goBack();
      },
    });
  }

  edit() {
    this.newsService.update(this.news).subscribe({
      next: () => {
        this.snackBar.open('Die News wurde erfolgreich gespeichert.');
        this.goBack();
      },
      error: (e) => {
        this.snackBar.open('Die News konnte nicht gespeichert werden.');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
