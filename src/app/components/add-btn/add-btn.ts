import { Component } from '@angular/core';
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
}
