import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from './models/user';
import { StorageService } from './services/storage.service';
import { setDefaultOptions } from 'date-fns';
import { AuthenticationService } from './services/authentication.service';
import { de } from 'date-fns/locale';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user: User | undefined;

  constructor(
    private storageService: StorageService,
    private authSevice: AuthenticationService,
    private cdRef: ChangeDetectorRef,
  ) {
    setDefaultOptions({ locale: de });
    this.getUser();
    this.storageService.storageSub.subscribe((key: string) => {
      this.getUser();
      this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.authSevice.refresh(this.user.email!).subscribe({
        next: () => {},
        error: () => {
          this.authSevice.logout();
        },
      });
    }
  }

  getUser() {
    let storageUser = localStorage.getItem('currentUser');

    if (!storageUser) {
      this.user = undefined;
      return;
    }

    this.user = JSON.parse(storageUser);
  }
}
