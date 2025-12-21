import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule, Pencil } from 'lucide-angular';

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
   * Input properties
   */
  readonly label = input.required<string>();
  readonly icon = input.required<any>();

  protected openModal() {
    console.log('open modal');
  }

  protected editSupplier() {
    console.log('edit supplier');
  }
}
