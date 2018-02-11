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
  fullName: String = ''; 
  user: User;

  public config: ToasterConfig = new ToasterConfig({
    animation: 'fade',
    limit: 3,
    positionClass: 'toast-bottom-full-width',
    timeout: 3000
  });

  constructor(private storageService: StorageService) { 
    this.storageService.storageSub.subscribe((data: string) => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if(user) {
        this.fullName = user.firstname + ' ' + user.lastname;
        this.user = user;
      } else {
        this.fullName = 'Login';
        this.user = undefined;
      }
    });}

  ngOnInit(): void {
  }
  
}
