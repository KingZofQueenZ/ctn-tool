import { Component, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { News } from 'src/app/models/news';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { Editor, Toolbar } from 'ngx-editor';
import { editorToolbar } from '../../../shared/settings';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss'],
})
export class EditNewsComponent implements OnDestroy {
  @Input() news!: News;
  editor: Editor;
  toolbar: Toolbar = editorToolbar;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    protected location: Location,
    private helper: HelperService,
  ) {
    this.editor = new Editor();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.newsService.getById(id!).subscribe({
      next: (news) => (this.news = news),
      error: () => this.location.back(),
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  edit() {
    this.newsService.update(this.news).subscribe({
      next: () => {
        this.helper.successSnackbar('Die News wurde erfolgreich gespeichert.');
        this.location.back();
      },
      error: () => this.helper.successSnackbar('Die News konnte nicht gespeichert werden.'),
    });
  }
}
