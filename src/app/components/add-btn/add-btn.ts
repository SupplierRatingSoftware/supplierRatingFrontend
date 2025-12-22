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
   * lucide-icon for the floating button
   */
  readonly Plus = Plus;

  /**
   * Event emitted when the add button is activated (for example, clicked).
   *
   * Parent components should handle this output to start their corresponding workflow
   */
  readonly action = output<void>();

  protected onClick() {
    this.action.emit();
  }
}
