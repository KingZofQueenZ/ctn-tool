import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { EventListOverviewComponent } from './event/event-list-overview/event-list-overview.component';
import { AuthGuard } from './shared/auth.guard';
import { DetailComponent } from './event/detail/detail.component';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { OverviewComponent } from './admin/overview/overview.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events', component: EventListOverviewComponent},
  { path: 'details/:id', component: DetailComponent },
  { path: 'admin', component: OverviewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
