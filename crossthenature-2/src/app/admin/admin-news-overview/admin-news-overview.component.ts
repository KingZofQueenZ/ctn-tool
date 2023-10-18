import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { DeleteNewsDialog } from './delete-dialog/delete-news-dialog.component';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-admin-news-overview',
  templateUrl: './admin-news-overview.component.html',
  styleUrls: ['./admin-news-overview.component.scss'],
})
export class AdminNewsOverviewComponent implements OnInit {
  news: News[] = [];
  page = 1;
  noNews: Boolean = false;
  loading: Boolean = false;
  allNews: Boolean = false;

  constructor(
    private newsService: NewsService,
    public dialog: MatDialog,
    private helper: HelperService,
  ) {}

  ngOnInit() {
    this.getNews();
  }

  getNews(): void {
    this.loading = true;
    this.newsService.getAll(this.page).subscribe((news) => {
      news.forEach((element) => {
        this.news.push(element);
      });

      if (!this.news.length) {
        this.noNews = true;
      }

      if (news.length < 10) {
        this.allNews = true;
      }

      this.loading = false;
    });
  }

  private refresh() {
    this.page = 1;
    this.news = [];
    this.getNews();
  }

  public load() {
    this.page++;
    this.getNews();
  }

  deleteNews(news: News) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      title: news.title,
    };
    const dialogRef = this.dialog.open(DeleteNewsDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newsService.delete(news._id).subscribe({
          next: () => {
            this.helper.successSnackbar('Die News wurde erfolgreich gelöscht.');
            this.refresh();
          },
          error: () => this.helper.errorSnackbar('Die News konnte nicht gelöscht werden.'),
        });
      }
    });
  }
}
