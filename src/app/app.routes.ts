import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {RatingsComponent} from './pages/ratings/ratings.component';
import {SuppliersComponent} from './pages/suppliers/suppliers.component';
import {OrdersComponent} from './pages/orders/orders.component';
import {AppRoutes} from './app.routes.config';

export const routes: Routes = [
  // 1. Redirect root URL
  { path: '', redirectTo: `${AppRoutes.BASE}/dashboard`, pathMatch: 'full' },

  // 2. Login Page
  { path: 'login', component: LoginComponent },

  // 3. Protected Area after login
  {
    path: AppRoutes.BASE,
    component: MainLayoutComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "orders", component: OrdersComponent },
      { path: "suppliers", component: SuppliersComponent },
      { path: "ratings", component: RatingsComponent },
    ]
  }
];
