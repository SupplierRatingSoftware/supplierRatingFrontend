import { Component } from '@angular/core';
import { LucideAngularModule, Pencil, UserStar } from 'lucide-angular';

@Component({
  selector: 'app-list-item',
  imports: [LucideAngularModule],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
})
export class ListItem {
  /**
   * Lucide Icons
   * @protected
   */
  protected readonly UserStar = UserStar;
  protected readonly Pencil = Pencil;
}
