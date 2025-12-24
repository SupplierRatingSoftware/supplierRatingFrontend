// 1. Wir müssen 'signal' und 'OnInit' von Angular importieren
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // NgbActiveModal hinzugefügt
// Wir importieren jetzt alles gesammelt aus der Model-Datei
import { Supplier, SupplierMapper } from '../../models/supplier.model';

@Component({
  selector: 'app-modal-form-supplier',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule],
  templateUrl: './modal-form-supplier.html',
  styleUrl: './modal-form-supplier.scss',
})
// 3. Wir sagen der Klasse, dass sie 'OnInit' (beim Starten) etwas tun soll
export class ModalFormSupplierComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  // 4. Das "Postfach": Hier landet der Lieferant, wenn wir auf 'Edit' klicken.
  // Using a writable signal to allow setting via componentInstance (NgbModal pattern)
  supplier = signal<Supplier | undefined>(undefined);

  supplierForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    street: new FormControl('', { nonNullable: true }),
    poBox: new FormControl('', { nonNullable: true }),
    zipCode: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    country: new FormControl('Schweiz', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    website: new FormControl('', { nonNullable: true }),
    vatNumber: new FormControl('', { nonNullable: true }),
    paymentConditions: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  // 5. Diese Funktion wird automatisch ausgeführt, sobald das Modal geöffnet wird
  ngOnInit() {
    // Wir prüfen: Liegt ein Lieferant im Postfach?
    const currentSupplier = this.supplier();
    if (currentSupplier) {
      // +++ GEÄNDERT: Wir nutzen jetzt den Mapper +++
      // Wir lassen den Mapper die Arbeit machen und erhalten fertige Daten fürs Formular
      const formData = SupplierMapper.mapSupplierToForm(currentSupplier);

      // Jetzt müssen wir nur noch diese fertigen Daten ins Formular "patchen"
      this.supplierForm.patchValue(formData);
    }
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      this.activeModal.close(this.supplierForm.value);
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
