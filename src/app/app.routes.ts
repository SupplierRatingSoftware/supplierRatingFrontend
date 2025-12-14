import {Routes} from '@angular/router';
import {Component} from '@angular/core';
import {LoginComponent} from './pages/login/login.component';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';

// This component renders INSIDE the MainLayoutComponent's <router-outlet>
@Component({
  template: `
    <div class="p-4">
      <h1>Dashboard Works!</h1>
      <p>This is the content area.</p>
    </div>
  `
})
export class DashboardPlaceholder {}

export const routes: Routes = [
  // 1. Redirect root URL
  { path: '', redirectTo: 'main/dashboard', pathMatch: 'full' },

  // 2. Login Page
  { path: 'login', component: LoginComponent },

  // 3. Protected Area after login
  {
    path: 'main',
    component: MainLayoutComponent,
    children: [
      { path: "dashboard", component: DashboardPlaceholder },
      // Later: { path: 'lieferanten', component: LieferantenComponent }, etc.
    ]
  }
];
