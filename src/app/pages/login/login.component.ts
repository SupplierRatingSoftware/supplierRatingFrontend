import {Component} from '@angular/core';
import {ThemeSwitcherComponent} from '../../components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-login',
  imports: [
    ThemeSwitcherComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

}
