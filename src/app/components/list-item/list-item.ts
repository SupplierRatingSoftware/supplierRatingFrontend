import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, LucideIconData, Pencil, User } from 'lucide-angular';

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
   * @description Optional: LabelSecondary is for the displayed secondary text of the list item.
   * @description Icon is for the displayed icon of the list item.
   * @readonly
   */
  readonly label = input.required<string>();
  readonly labelSecondary = input<string>();
  readonly icon = input.required<LucideIconData>();

  /**
   * Input (optional): This input indicating the active status.
   * The default value is `false`, signifying an inactive state.
   */
  readonly isActive = input(false);

  /**
   * Output: Event emitted when the item or edit button is clicked
   * @readonly
   */
  readonly itemSelected = output<void>();
  readonly editSelected = output<void>();

  /**
   * Computed class for secondary label styling based on icon and value
   */
  readonly secondaryLabelClass = computed(() => {
    // if the list-item icon isn't correct, don't color the text
    if (this.icon() !== User) return '';

    // change text color to red if value is 0
    const val = this.labelSecondary();
    if (val === '0') return 'text-danger';

    // change text color to green if value is a positive number
    const num = Number(val);
    if (!isNaN(num) && num > 0) return 'text-success';

    return '';
  });

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
