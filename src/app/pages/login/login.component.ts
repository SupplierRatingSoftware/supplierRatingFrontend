import { Component, inject, signal } from '@angular/core';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutes } from '../../app.routes.config';

@Component({
  selector: 'app-login',
  imports: [ThemeSwitcherComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  /**
   * Angular Router Service
   * @private
   */
  private router = inject(Router);

  /**
   * Signals for username and password input fields
   */
  readonly username = signal('');
  readonly password = signal('');

  /**
   * Method for handling login
   * TODO: ATTENTION HARDCODED CREDENTIALS ONLY FOR SCHOOL PRESENTATION PURPOSES IMPLEMENTED!!!
   */
  onLogin() {
    console.log(this.username() + ' | ' + this.password());
    if (this.username() === 'test' && this.password() === 'test') {
      console.log('Login erfolgreich');
      this.router.navigate([AppRoutes.BASE, 'dashboard']);
    } else {
      alert('Ungültige Zugangsdaten. Bitte versuchen Sie es erneut.');
    }
  }
}
