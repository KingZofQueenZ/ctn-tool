import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './content/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { ImpressumComponent } from './content/impressum/impressum.component';
import { ContactComponent } from './content/contact/contact.component';
import { InformationComponent } from './content/information/information.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UserService } from './services/user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { ActivateComponent } from './user/activate/activate.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { ResetComponent } from './user/reset/reset.component';
import { SettingsComponent } from './user/settings/settings.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { AdminNewsOverviewComponent } from './admin/admin-news-overview/admin-news-overview.component';
import { NewsService } from './services/news.service';
import { CreateNewsComponent } from './admin/news/create-news/create-news.component';
import { EditNewsComponent } from './admin/news/edit-news/edit-news.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialog } from './admin/admin-news-overview/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImpressumComponent,
    ContactComponent,
    InformationComponent,
    LoginComponent,
    RegisterComponent,
    ActivateComponent,
    ProfileComponent,
    ChangePasswordComponent,
    ResetComponent,
    SettingsComponent,
    AdminOverviewComponent,
    AdminNewsOverviewComponent,
    CreateNewsComponent,
    DeleteDialog,
    EditNewsComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    UserService,
    AuthenticationService,
    StorageService,
    NewsService,
    MatSnackBarModule,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000, verticalPosition: 'top' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
