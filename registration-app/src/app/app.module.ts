import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AuthGuard } from './shared/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { ResetComponent } from './user/reset/reset.component';
import { RegisterComponent } from './user/register/register.component';
import { EventListItemComponent } from './event/event-list-item/event-list-item.component';
import { EventListOverviewComponent } from './event/event-list-overview/event-list-overview.component';
import { EventDetailComponent } from './event/detail/event-detail.component';

import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { EventService } from './services/event.service';
import { StorageService } from './services/storage.service';

import { AppRoutingModule } from './app-routing.module';
import { CustomMaterializeModule } from './shared/materialize.module';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { EditEventComponent } from './admin/edit-event/edit-event.component';
import { AdminEventOverviewComponent } from './admin/admin-event-overview/admin-event-overview.component';
import { AdminUserOverviewComponent } from './admin/admin-user-overview/admin-user-overview.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { NextEventComponent } from './admin/next-event/next-event.component';
import { ActivateComponent } from './user/activate/activate.component';
import { HomeComponent } from './content/home/home.component';
import { NewsOverviewComponent } from './news/news-overview/news-overview.component';
import { DeleteEventComponent } from './admin/delete-event/delete-event.component';
import { ProfileComponent } from './user/profile/profile.component';
import { InformationComponent } from './content/information/information.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { SafeHtmlPipe } from './shared/safe-html-pipe.pipe';
import { ChangepasswordComponent } from './user/changepassword/changepassword.component';
import { SettingsComponent } from './user/settings/settings.component';
import { ContactComponent } from './content/contact/contact.component';
import { ImpressumComponent } from './content/impressum/impressum.component';
import { NewsService } from './services/news.service';
import { AdminNewsOverviewComponent } from './admin/admin-news-overview/admin-news-overview.component';
import { CreateNewsComponent } from './admin/news/create-news/create-news.component';
import { EditNewsComponent } from './admin/news/edit-news/edit-news.component';
import { MatButtonModule, MatDialogModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatSidenavModule, MatTooltipModule } from '@angular/material';
import { DeleteDialog } from './admin/admin-news-overview/delete-dialog/delete-dialog.component';
import { DeleteUserDialog } from './admin/admin-user-overview/delete-user-dialog/delete-user-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EventListOverviewComponent,
    EventDetailComponent,
    EventListItemComponent,
    CreateEventComponent,
    EditEventComponent,
    AdminEventOverviewComponent,
    AdminOverviewComponent,
    NextEventComponent,
    AdminUserOverviewComponent,
    ActivateComponent,
    ResetComponent,
    HomeComponent,
    NewsOverviewComponent,
    DeleteEventComponent,
    ProfileComponent,
    InformationComponent,
    SafeHtmlPipe,
    ChangepasswordComponent,
    SettingsComponent,
    ContactComponent,
    ImpressumComponent,
    AdminNewsOverviewComponent,
    CreateNewsComponent,
    EditNewsComponent,
    DeleteDialog,
    DeleteUserDialog
  ],
  
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClient,
    CustomMaterializeModule,
    BrowserAnimationsModule,
    ToasterModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  entryComponents: [DeleteDialog, DeleteUserDialog],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
    AuthenticationService,
    UserService,
    EventService,
    StorageService,
    ToasterService,
    NewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
