import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-admin-user-overview',
  templateUrl: './admin-user-overview.component.html',
  styleUrls: ['./admin-user-overview.component.scss']
})
export class AdminUserOverviewComponent implements OnInit {
  delUser: User;
  noUsers: Boolean = false;
  users: User[] = [];

  constructor(private userService: UserService, private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  setUserToDelete(user: User) {
    this.delUser = user;
  }

  deleteUser() {
    this.userService.delete(this.delUser._id).subscribe(
      result => {
        this.toasterService.pop('success', 'Löschen erfolgreich', 'Der User wurde erfolgreich gelöscht.');
        this.refresh();
      },
      error => {
        this.toasterService.pop('error', 'Löschen fehlerhaft', 'Der User konnte nicht gelöscht werden!');
      }
    );
  }

  private getUsers() {
    this.userService.getAll().subscribe(users => {
      users.forEach((element) => {
        this.users.push(element);
        this.noUsers = false;
      });

      if (!this.users.length) {
        this.noUsers = true;
      }
    });
  }

  private refresh() {
    this.noUsers = true;
    this.users = [];
    this.getUsers();
  }

}
