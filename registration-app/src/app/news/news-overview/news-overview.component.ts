import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { News } from '../../models/news';
import { NewsService } from '../../services/news.service';
import * as moment from 'moment';
import { SafeHtmlPipe } from '../../shared/safe-html-pipe.pipe';

@Component({
  selector: 'app-news-overview',
  templateUrl: './news-overview.component.html',
  styleUrls: ['./news-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsOverviewComponent implements OnInit {
  news: News[] = [];
  page = 1;
  noNews: Boolean = false;
  loading: Boolean = false;
  allNews: Boolean = false;

  constructor(private newsService: NewsService) { 
    moment.locale('de');
  }

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
  
  public load() {
    this.page++;
    this.getNews();
  }

  private dateString(news: News) {
    return moment(news.date).format('dd. D MMM YYYY / HH:mm') + ' Uhr';
  }
}
