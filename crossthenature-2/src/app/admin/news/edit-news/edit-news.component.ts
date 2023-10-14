import { Component, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { News } from 'src/app/models/news';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../../shared/settings';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss'],
})
export class EditNewsComponent implements OnDestroy {
  @Input() news!: News;
  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {
    this.editor = new Editor();
  }

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
    console.log(this.news);
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
