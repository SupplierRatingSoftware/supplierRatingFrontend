import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'; // inject hinzugefügt
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Den Modal-Dienst importieren
import { ModalFormSupplierComponent } from '../../components/modal-form-supplier/modal-form-supplier';
import { User } from 'lucide-angular';

@Component({
  selector: 'app-suppliers',
  // Hier registrieren wir die Komponenten, die wir im HTML-Skelett direkt benutzen
  imports: [ListSearch, AddBtn, ListItem],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersComponent {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly User = User;

  //Der Modal-Service: Das ist unser "Werkzeugkasten", um Pop-ups zu öffnen
  private modalService = inject(NgbModal);

  // State: List of suppliers
  readonly suppliers = signal<string[]>(['Lieferant A', 'Lieferant B']);

  //Diese Funktion öffnet jetzt das Modal-Fenster
  openSupplierModal() {
    // modalService.open sagt: "Öffne ein Fenster mit dem Inhalt dieser Komponente"
    const modalRef = this.modalService.open(ModalFormSupplierComponent, {
      size: 'lg', // Größe: Large
      centered: true, // Schön mittig auf dem Bildschirm
      backdrop: 'static', // Verhindert Schliessen beim Klicken in den grauen Bereich
    });

    // Hier warten wir darauf, was der User im Modal macht
    modalRef.result.then(
      result => {
        // Wenn der User auf "Speichern" klickt und Daten zurückkommen
        if (result && result.fullName) {
          this.addSupplierFromModal(result.fullName);
        }
      },
      () => {
        // Dieser Bereich wird ausgeführt, wenn das Modal abgebrochen wird (X oder Abbrechen)
        console.log('Modal wurde geschlossen ohne zu speichern');
      }
    );
  }

  // Hilfsfunktion, um den neuen Namen in deine Signal-Liste zu schreiben
  private addSupplierFromModal(name: string) {
    this.suppliers.update(current => [...current, name]);
  }
}
