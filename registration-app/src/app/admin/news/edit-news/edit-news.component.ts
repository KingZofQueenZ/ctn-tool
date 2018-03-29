import { Component, Input, OnInit } from '@angular/core';
import { News } from '../../../models/news';
import { MzInputModule } from 'ng2-materialize';
import { NewsService } from '../../../services/news.service';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss']
})
export class EditNewsComponent implements OnInit {
  @Input() news: News;
  ckeConfig = {
    toolbar: [
      { name: 'document', items: [ 'Source' ] },
			{ name: 'clipboard', items: [ 'Undo', 'Redo' ] },
			{ name: 'styles', items: [ 'Format', 'FontSize' ] },
      { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
			{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'CopyFormatting' ] },
			{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'Blockquote' ] },
			{ name: 'links', items: [ 'Link', 'Unlink' ] },
			{ name: 'insert', items: [ 'Image', 'EmbedSemantic', 'Table', 'HorizontalRule', 'Smiley' ] },
			{ name: 'tools', items: [ 'Maximize' ] }
    ],
    removeDialogTabs: 'image:advanced;link:advanced',
    extraPlugins: 'divarea',
    height: 350
  };

  constructor(private route: ActivatedRoute, private newsService: NewsService, private location: Location, private toasterService: ToasterService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.newsService.getById(id).subscribe(
      news => {
        this.news = news;
      },
      error => {
        this.goBack();
    });
  }

  edit() {
    this.newsService.update(this.news).subscribe(
      result => {
        this.toasterService.pop('success', 'Editieren erfolgreich', 'Die News wurde erfolgreich gespeichert.');
        this.goBack();
      }, 
      error => {
        this.toasterService.pop('error', 'Editieren nicht erfolgreich', 'Die News konnte nicht gespeichert werden.');
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

}
