import { Component } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MzInputModule } from 'ng2-materialize';
import { ToasterService } from 'angular2-toaster';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private location: Location) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
     }

  update() {
    this.userService.update(this.user)
      .subscribe(
        result => {
          this.storageService.updateItem(this.user);
          this.toasterService.pop('success', 'Benutzerdaten ändern erfolgreich', 'Die Benutzerdaten wurden erfolgreich geändert.');
          this.router.navigate(['/profile']);
        },
        error => {
          this.toasterService.pop('error', 'Benutzerdaten ändern fehlgeschlagen', 'Die Benutzerdaten konnten nicht geändert werden.');
        }
      );
  }

  goBack(): void {
    this.location.back();
  }
}
