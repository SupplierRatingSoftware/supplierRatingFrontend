import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap'; // Für das Dropdown

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  // Signal für den Collapsed-Status (Standard: false/nicht eingeklappt)
  isCollapsed = signal(false);

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}
