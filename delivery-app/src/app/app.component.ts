import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebTrackerComponent } from './components/web-tracker/web-tracker.component';
import { WebDriverComponent } from './components/web-driver/web-driver.component';
import { WebAdminComponent } from './components/web-admin/web-admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WebTrackerComponent,
    WebDriverComponent,
    WebAdminComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'delivery-app';
}
