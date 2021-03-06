import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { EventListOverviewComponent } from './event/event-list-overview/event-list-overview.component';
import { AuthGuard } from './shared/auth.guard';
import { EventDetailComponent } from './event/detail/event-detail.component';
import { AdminEventOverviewComponent } from './admin/admin-event-overview/admin-event-overview.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { AdminUserOverviewComponent } from './admin/admin-user-overview/admin-user-overview.component';
import { ActivateComponent } from './user/activate/activate.component';
import { ResetComponent } from './user/reset/reset.component';
import { HomeComponent } from './content/home/home.component';
import { NewsOverviewComponent } from './news/news-overview/news-overview.component';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { EditEventComponent } from './admin/edit-event/edit-event.component';
import { DeleteEventComponent } from './admin/delete-event/delete-event.component';
import { ProfileComponent } from './user/profile/profile.component';
import { InformationComponent } from './content/information/information.component';
import { ChangepasswordComponent } from './user/changepassword/changepassword.component';
import { SettingsComponent } from './user/settings/settings.component';
import { ContactComponent } from './content/contact/contact.component';
import { ImpressumComponent } from './content/impressum/impressum.component';
import { AdminNewsOverviewComponent } from './admin/admin-news-overview/admin-news-overview.component';
import { EditNewsComponent } from './admin/news/edit-news/edit-news.component';
import { CreateNewsComponent } from './admin/news/create-news/create-news.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'information', component: InformationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'news', component: NewsOverviewComponent},
  { path: 'impressum', component: ImpressumComponent},
  { path: 'events', component: EventListOverviewComponent},
  { path: 'details/:id', component: EventDetailComponent },
  { path: 'activate/:code', component: ActivateComponent },
  { path: 'admin', component: AdminOverviewComponent, canActivate: [AuthGuard] },
  { path: 'admin-event', component: AdminEventOverviewComponent, canActivate: [AuthGuard] },
  { path: 'admin-event-create', component: CreateEventComponent, canActivate: [AuthGuard] },
  { path: 'admin-event-edit/:id', component: EditEventComponent, canActivate: [AuthGuard] },
  { path: 'admin-event-delete/:id', component: DeleteEventComponent, canActivate: [AuthGuard] },
  { path: 'admin-user', component: AdminUserOverviewComponent, canActivate: [AuthGuard] },
  { path: 'admin-news', component: AdminNewsOverviewComponent, canActivate: [AuthGuard] },
  { path: 'admin-news-create', component: CreateNewsComponent, canActivate: [AuthGuard] },
  { path: 'admin-news-edit/:id', component: EditNewsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'password', component: ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
