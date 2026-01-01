import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'; // output hinzugefügt
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
   * Input: Properties for the list item.
   * @description Label is for the displayed text of the list item.
   * @description Icon is for the displayed icon of the list item.
   * @readonly
   */
  readonly label = input.required<string>();
  readonly icon = input.required<LucideIconData>();

  /**
   * Output: Event emitted when the item or edit button is clicked
   * @readonly
   */
  readonly itemSelected = output<void>();
  readonly editSelected = output<void>();

  /**
   * Click on list-item
   * @protected
   */
  protected showContent() {
    this.itemSelected.emit();
  }

  /**
   * Click on edit-button in list-item
   * @protected
   */
  protected editContent() {
    this.editSelected.emit();
  }
}
