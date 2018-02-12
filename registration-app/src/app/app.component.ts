import { Component } from '@angular/core';
import { User } from './models/user';
import { StorageService } from './services/storage.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MzSidenavModule, MzIconModule, MzIconMdiModule } from 'ng2-materialize';
import { ToasterConfig } from 'angular2-toaster/src/toaster-config';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User;

  public config: ToasterConfig = new ToasterConfig({
    animation: 'fade',
    limit: 3,
    positionClass: 'toast-bottom-full-width',
    timeout: 3000
  });

  constructor(private storageService: StorageService) {
    this.getUser();

    storageService.storageSub.subscribe((key: string) => {
      this.getUser();
    });
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      this.user = user;
    } else {
      this.user = null;
    }
  }
}
