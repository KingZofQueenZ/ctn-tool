import { Component, OnDestroy } from '@angular/core';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { Location } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../../shared/settings';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss'],
})
export class CreateNewsComponent implements OnDestroy {
  news: News = new News();
  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  constructor(
    private newsService: NewsService,
    protected location: Location,
    private helper: HelperService,
  ) {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  create() {
    this.newsService.create(this.news).subscribe({
      next: () => {
        this.helper.errorSnackbar('Die News wurde erfolgreich erstellt.');
        this.location.back();
      },
      error: () => this.helper.errorSnackbar('Die News konnte nicht erstellt werden.'),
    });
  }
}
