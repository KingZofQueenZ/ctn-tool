import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AuthGuard } from './shared/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { EditEventComponent } from './admin/edit-event/edit-event.component';
import { AdminEventOverviewComponent } from './admin/admin-event-overview/admin-event-overview.component';
import { AdminUserOverviewComponent } from './admin/admin-user-overview/admin-user-overview.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { NextEventComponent } from './admin/next-event/next-event.component';
import { ActivateComponent } from './user/activate/activate.component';

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
    ActivateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CustomMaterializeModule,
    BrowserAnimationsModule,
    ToasterModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
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
    ToasterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
