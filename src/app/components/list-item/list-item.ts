import { Component } from '@angular/core';
import { LucideAngularModule, UserStar } from 'lucide-angular';

@Component({
  selector: 'app-list-item',
  imports: [LucideAngularModule],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
})
export class ListItem {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly UserStar = UserStar;
}
