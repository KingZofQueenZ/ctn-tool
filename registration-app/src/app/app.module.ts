import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AuthGuard } from './shared/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { EventListItemComponent } from './event/event-list-item/event-list-item.component';
import { EventListOverviewComponent } from './event/event-list-overview/event-list-overview.component';
import { DetailComponent } from './event/detail/detail.component';

import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { EventService } from './services/event.service';
import { StorageService } from './services/storage.service';

import { AppRoutingModule } from './app-routing.module';
import { CustomMaterializeModule } from './shared/materialize.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { OverviewComponent } from './admin/overview/overview.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EventListOverviewComponent,
    DetailComponent,
    EventListItemComponent,
    CreateEventComponent,
    OverviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CustomMaterializeModule,
    BrowserAnimationsModule,
    ToasterModule,
    InfiniteScrollModule
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
