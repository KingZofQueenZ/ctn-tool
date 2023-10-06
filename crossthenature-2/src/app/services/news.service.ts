import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../models/news';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable()
export class NewsService {
  constructor(private http: HttpClient) {}

  // POST /news
  create(news: News): Observable<News> {
    return this.http.post<News>('/api/news', news, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // GET /news
  getAll(page?: number): Observable<News[]> {
    return this.http.get<News[]>('/api/news?page=' + page);
  }

  // GET /news/{news-id}
  getById(_id: string): Observable<News> {
    return this.http.get<News>('/api/news/' + _id);
  }

  // PUT /news/{news-id}
  update(news: News): Observable<any> {
    return this.http.put('/api/news/' + news._id, news, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }

  // DELETE /evnewsents/{news-id}
  delete(_id: string): Observable<News> {
    return this.http.delete<News>('/api/news/' + _id, {
      headers: headers,
      responseType: 'text' as 'json',
    });
  }
}
