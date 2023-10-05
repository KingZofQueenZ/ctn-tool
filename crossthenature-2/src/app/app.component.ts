import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user: User | undefined;

  /*public config: ToasterConfig = new ToasterConfig({
    animation: 'fade',
    limit: 3,
    positionClass: 'toast-bottom-full-width',
    timeout: 4000,
  });*/

  constructor(/*private storageService: StorageService,
    private authSevice: AuthenticationService,
    private cdRef: ChangeDetectorRef*/) {
    this.getUser();
    //this.storageService.storageSub.subscribe((key: string) => {
    //this.getUser();
    //this.cdRef.detectChanges();
    //});
  }

  ngOnInit(): void {
    if (this.user) {
      /*this.authSevice.refresh(this.user.email).subscribe(
        response => {
        },
        error => {
          this.authSevice.logout();
        }
      );*/
    }
  }

  getUser() {
    this.user = new User(
    ); //JSON.parse(localStorage.getItem('currentUser'));
  }
}
