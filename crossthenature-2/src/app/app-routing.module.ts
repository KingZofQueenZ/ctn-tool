import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { InformationComponent } from './content/information/information.component';
import { ContactComponent } from './content/contact/contact.component';
import { ImpressumComponent } from './content/impressum/impressum.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ActivateComponent } from './user/activate/activate.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthGuard } from './shared/auth.guard';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { ResetComponent } from './user/reset/reset.component';
import { SettingsComponent } from './user/settings/settings.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { AdminNewsOverviewComponent } from './admin/admin-news-overview/admin-news-overview.component';
import { CreateNewsComponent } from './admin/news/create-news/create-news.component';
import { EditNewsComponent } from './admin/news/edit-news/edit-news.component';
import { NewsOverviewComponent } from './news/news-overview/news-overview.component';
import { AdminUserOverviewComponent } from './admin/admin-user-overview/admin-user-overview.component';
import { EventListOverviewComponent } from './event/event-list-overview/event-list-overview.component';
import { AdminEventOverviewComponent } from './admin/admin-event-overview/admin-event-overview.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { EditEventComponent } from './admin/edit-event/edit-event.component';
import { CreateEventComponent } from './admin/create-event/create-event.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'information', component: InformationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'news', component: NewsOverviewComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'activate/:code', component: ActivateComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventListOverviewComponent },
  { path: 'details/:id', component: EventDetailComponent },
  {
    path: 'admin-user',
    component: AdminUserOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-event',
    component: AdminEventOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-event-create',
    component: CreateEventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-event-edit/:id',
    component: EditEventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-news',
    component: AdminNewsOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-news-create',
    component: CreateNewsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-news-edit/:id',
    component: EditNewsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
