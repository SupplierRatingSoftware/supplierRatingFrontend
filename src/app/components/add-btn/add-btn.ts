import { Component, output } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-add-btn',
  imports: [LucideAngularModule],
  templateUrl: './add-btn.html',
  styleUrl: './add-btn.scss',
})
export class AddBtn {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly Plus = Plus;

  /**
   * Output: Event emitted when the add button is clicked
   * @readonly
   */
  readonly action = output<void>();

  protected onClick() {
    this.action.emit();
  }
}
