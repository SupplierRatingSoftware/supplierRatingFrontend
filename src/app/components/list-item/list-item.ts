import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule, LucideIconData, Pencil } from 'lucide-angular';

@Component({
  selector: 'app-list-item',
  imports: [LucideAngularModule],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItem {
  /**
   * Lucide Icons
   * @protected
   */
  protected readonly Pencil = Pencil;

  /**
   * Input properties for dynamically rendering the component
   * @readonly
   */
  readonly label = input.required<string>();
  readonly icon = input.required<LucideIconData>();

  /**
   * Click on List-Item
   * @protected
   */
  protected showContent() {
    console.log('open modal');
  }

  /**
   * Click on Edit-Button in List-Item
   * @protected
   */
  protected editContent() {
    console.log('open edit');
  }
}
