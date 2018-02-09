import { Component } from '@angular/core';
import { User } from './models/user';
import { StorageService } from './services/storage.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MzSidenavModule, MzIconModule, MzIconMdiModule } from 'ng2-materialize';
import { ToasterConfig } from 'angular2-toaster/src/toaster-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: any;

  public config: ToasterConfig = new ToasterConfig({
    animation: 'fade',
    limit: 3,
    positionClass: 'toast-bottom-full-width',
    timeout: 3000
  });

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.setUserName();

    this.storageService.watchStorage().subscribe((data: string) => {
      this.setUserName();
    });
  }

  setUserName() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        this.user = user;
        console.log(user);
      } else {
        this.user = null;
      }
  }

  getFullName(alt?: string): string {
    if (this.user) {
      return this.user.firstname + ' ' + this.user.lastname;
    }

    if (alt) {
      return alt;
    }

    return '';
  }

  getEmail(): string {
    if (this.user) {
      return this.user.email;
    }

    return '';
  }
}
