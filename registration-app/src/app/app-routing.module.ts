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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'news', component: NewsOverviewComponent},
  { path: 'events', component: EventListOverviewComponent},
  { path: 'details/:id', component: EventDetailComponent },
  { path: 'activate/:code', component: ActivateComponent },
  { path: 'admin', component: AdminOverviewComponent, canActivate: [AuthGuard] },
  { path: 'admin-event', component: AdminEventOverviewComponent, canActivate: [AuthGuard] },
  { path: 'admin-user', component: AdminUserOverviewComponent, canActivate: [AuthGuard] }

];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
