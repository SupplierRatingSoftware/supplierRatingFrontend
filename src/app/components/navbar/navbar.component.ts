import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  imports: [ThemeSwitcherComponent, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private sidebarService = inject(SidebarService);

  protected readonly MenuIcon = Menu;
  protected readonly XIcon = X;

  isMobileMenuOpen = this.sidebarService.isMobileMenuOpen;

  toggleMobileMenu() {
    this.sidebarService.toggleMobileMenu();
  }
}
