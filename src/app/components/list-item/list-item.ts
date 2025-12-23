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
   * Input properties for dynamically rendering the component
   * @readonly
   */
  readonly label = input.required<string>();
  readonly icon = input.required<LucideIconData>();
  // NEU: Definiere das Event für die Auswahl
  readonly itemSelected = output<void>();

  /**
   * Click on List-Item
   * @protected
   */
  protected showContent() {
    // Sende das Event nach oben an die SuppliersComponent
    this.itemSelected.emit();
  }

  /**
   * Click on Edit-Button in List-Item
   * @protected
   */
  protected editContent() {
    console.log('Edit clicked - noch nicht implementiert');
  }
}
