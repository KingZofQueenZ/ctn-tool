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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'information', component: InformationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'activate/:code', component: ActivateComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminOverviewComponent,
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
