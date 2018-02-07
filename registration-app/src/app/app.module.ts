import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './services/authentication.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AuthGuard } from './shared/auth.guard';
import { EventListOverviewComponent } from './event/event-list-overview/event-list-overview.component';
import { UserService } from './services/user.service';
import { EventService } from './services/event.service';
import { StorageService } from './services/storage.service';
import { CustomMaterializeModule } from './shared/materialize.module';
import { DetailComponent } from './event/detail/detail.component';
import { EventListItemComponent } from './event/event-list-item/event-list-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EventListOverviewComponent,
    DetailComponent,
    EventListItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CustomMaterializeModule,
    BrowserAnimationsModule,
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
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
