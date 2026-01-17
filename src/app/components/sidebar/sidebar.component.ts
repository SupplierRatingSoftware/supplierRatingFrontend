import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutes } from '../../app.routes.config';
import { ChevronLeft, ChevronRight, LayoutDashboard, LucideAngularModule, NotepadText, User } from 'lucide-angular';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgbDropdownModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);

  /**
   * Lucide Icons
   * @protected
   */
  protected readonly NotepadText = NotepadText;
  protected readonly User = User;
  protected readonly LayoutDashboard = LayoutDashboard;
  protected readonly ChevronRight = ChevronRight;
  protected readonly ChevronLeft = ChevronLeft;

  /**
   * Signal for the collapsed status on desktop
   */
  isCollapsed = signal(false);

  /**
   * Mobile menu open state from service
   */
  isMobileMenuOpen = this.sidebarService.isMobileMenuOpen;

  /**
   * Global base-routing
   * @protected
   */
  protected readonly baseRoute = AppRoutes.BASE;

  constructor() {
    // Auto-expand sidebar on larger screens
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(min-width: 768px)');

      // Set initial state
      if (mediaQuery.matches) {
        this.isCollapsed.set(false);
      }

      // Listen for screen size changes
      mediaQuery.addEventListener('change', e => {
        if (e.matches) {
          this.isCollapsed.set(false);
        }
      });
    }
  }

  /**
   * Toggle the sidebar collapsed state (desktop only)
   */
  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}
