import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutes } from '../../app.routes.config';
import { LayoutDashboard, LucideAngularModule, NotepadText, User } from 'lucide-angular';

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

  // Signal for the collapsed status (Standard: false/not collapsed)
  isCollapsed = signal(false);

  // Global base-routing
  protected readonly baseRoute = AppRoutes.BASE;

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}
