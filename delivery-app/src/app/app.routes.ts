import { Routes } from '@angular/router';
import { WebTrackerComponent } from './components/web-tracker/web-tracker.component';
import { WebDriverComponent } from './components/web-driver/web-driver.component';
import { WebAdminComponent } from './components/web-admin/web-admin.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'tracker', component: WebTrackerComponent },
  { path: 'driver', component: WebDriverComponent },
  { path: 'admin', component: WebAdminComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
