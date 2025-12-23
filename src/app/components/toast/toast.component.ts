import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  imports: [LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly X = X;

  readonly message = input<string | null>(null);
  readonly exitToast = output<void>();

  onClose() {
    this.exitToast.emit();
  }
}
