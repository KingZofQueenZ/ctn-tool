import { Component } from '@angular/core';
import { News } from '../../../models/news';
import { MzInputModule } from 'ng2-materialize';
import { NewsService } from '../../../services/news.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent {
  news: News = new News();
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

  constructor(private newsService: NewsService, private location: Location, private toasterService: ToasterService) { }

  create() {
    this.newsService.create(this.news).subscribe(
      result => {
        this.toasterService.pop('success', 'Erstellen erfolgreich', 'Die News wurde erfolgreich erstellt.');
        this.goBack();
      }, 
      error => {
        this.toasterService.pop('error', 'Erstellen nicht erfolgreich', 'Die News konnte nicht erstellt werden.');
      }
    )
  }
  
  goBack(): void {
    this.location.back();
  }
}
