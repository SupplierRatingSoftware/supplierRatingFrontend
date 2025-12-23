import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFormOrderComponent, OrderFormData } from '../../components/modal-form-order/modal-form-order'; // Pfad anpassen
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';
import { NotepadText, ShoppingCart } from 'lucide-angular'; // Anderes Icon für Bestellungen

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ListSearch, AddBtn, ListItem],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly NotepadText = NotepadText;
  protected readonly OrderIcon = ShoppingCart;
  private modalService = inject(NgbModal);

  // State: List of orders
  readonly orders = signal<string[]>(['Bestellung 1', 'Bestellung 2']);

  protected addOrder() {
    this.orders.update(current => [...current, `Bestellung ${current.length + 1}`]);
  }

  openOrderModal() {
    const modalRef = this.modalService.open(ModalFormOrderComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Hier warten wir darauf, was der User im Modal macht
    modalRef.result.then(
      (result: OrderFormData) => {
        // Wenn der User auf "Speichern" klickt und Daten zurückkommen
        if (result && result.shortName) {
          this.addOrderFromModal(result.shortName);
        }
      },
      () => {
        // Modal wurde bewusst ohne Speichern geschlossen; keine Aktion erforderlich.
      }
    );
  }

  // Hilfsfunktion, um den neuen Namen in deine Signal-Liste zu schreiben
  private addOrderFromModal(name: string) {
    this.orders.update(current => [...current, name]);
  }
}
