import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { DeleteUserDialog } from './delete-dialog/delete-user-dialog.component';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-admin-user-overview',
  templateUrl: './admin-user-overview.component.html',
  styleUrls: ['./admin-user-overview.component.scss'],
})
export class AdminUserOverviewComponent implements OnInit {
  noUsers: Boolean = false;
  users: User[] = [];

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private helper: HelperService,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  deleteUser(user: User) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      firstname: user.firstname,
      lastname: user.lastname,
    };
    const dialogRef = this.dialog.open(DeleteUserDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.delete(user._id).subscribe({
          next: () => {
            this.helper.successSnackbar('Der User wurde erfolgreich gelöscht.');
            this.refresh();
          },
          error: () => this.helper.successSnackbar('Der User konnte nicht gelöscht werden!'),
        });
      }
    });
  }

  private getUsers() {
    this.userService.getAll().subscribe((users) => {
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
