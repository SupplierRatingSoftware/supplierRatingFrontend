import { Component, inject, signal } from '@angular/core';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutes } from '../../app.routes.config';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-login',
  imports: [ThemeSwitcherComponent, FormsModule, ToastComponent],
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

  readonly message = signal<string | null>(null);

  /**
   * Method for handling login
   * TODO: ATTENTION HARDCODED CREDENTIALS ONLY FOR SCHOOL PRESENTATION PURPOSES IMPLEMENTED!!!
   */
  onLogin() {
    console.log(this.username() + ' | ' + this.password());
    if (this.username() === 'test' && this.password() === 'test') {
      this.router.navigate([AppRoutes.BASE, 'dashboard']);
    } else {
      this.message.set('Ungültige Zugangsdaten. Bitte versuchen Sie es erneut.');
    }
  }

  /**
   * Open toast component to display some errors
   * @protected
   */
  protected displayMessage(msg: string) {
    return msg;
  }
}
