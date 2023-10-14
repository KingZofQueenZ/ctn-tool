import { Component, OnDestroy } from '@angular/core';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../../shared/settings';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss'],
})
export class CreateNewsComponent implements OnDestroy {
  news: News = new News();
  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  constructor(
    private newsService: NewsService,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {
    this.editor = new Editor();
  }

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
