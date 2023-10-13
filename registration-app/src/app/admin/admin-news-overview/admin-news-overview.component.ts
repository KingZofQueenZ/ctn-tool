import { Component, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { NewsService } from '../../services/news.service';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteDialog } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-admin-news-overview',
  templateUrl: './admin-news-overview.component.html',
  styleUrls: ['./admin-news-overview.component.scss']
})
export class AdminNewsOverviewComponent implements OnInit {
  news: News[] = [];
  page = 1;
  noNews: Boolean = false;
  loading: Boolean = false;
  allNews: Boolean = false;

  constructor(private newsService: NewsService, private toasterService: ToasterService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getNews();
  }

  getNews(): void {
    this.loading = true;
    this.newsService.getAll(this.page).subscribe(news => {
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
    this.noNews = true;
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
    const dialogRef = this.dialog.open(DeleteDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.newsService.delete(news._id).subscribe(
          result => {
            this.toasterService.pop('success', 'Löschen erfolgreich', 'Die News wurde erfolgreich gelöscht.');
            this.refresh();
          },
          error => {
            this.toasterService.pop('error', 'Löschen fehlerhaft', 'Die News konnte nicht gelöscht werden!');
          }
        );
      }
    });
    

    
  }
}
