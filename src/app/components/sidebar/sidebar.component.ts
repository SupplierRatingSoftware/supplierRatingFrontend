import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutes } from '../../app.routes.config';
import { ChevronLeft, ChevronRight, LayoutDashboard, LucideAngularModule, NotepadText, User } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgbDropdownModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
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
   * Signal for the collapsed status
   */
  isCollapsed = signal(false);

  /**
   * Global base-routing
   * @protected
   */
  protected readonly baseRoute = AppRoutes.BASE;

  /**
   * Toggle the sidebar collapsed state
   */
  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}
