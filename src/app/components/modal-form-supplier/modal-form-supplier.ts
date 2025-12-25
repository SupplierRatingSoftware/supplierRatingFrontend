// 1. Wir müssen 'signal' und 'OnInit' von Angular importieren
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // NgbActiveModal hinzugefügt
// Wir importieren jetzt alles gesammelt aus der Model und Config-Datei
import { Supplier } from '../../models/supplier.model';
import { SUPPLIER_FORM_CONFIG } from '../../models/supplier.config';

@Component({
  selector: 'app-modal-form-supplier',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule],
  templateUrl: './modal-form-supplier.html',
  styleUrl: './modal-form-supplier.scss',
})
// 3. Wir sagen der Klasse, dass sie 'OnInit' (beim Starten) etwas tun soll
export class ModalFormSupplierComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  // 2. Konfiguration für das Template bereitstellen
  protected readonly config = SUPPLIER_FORM_CONFIG;

  // 4. Das "Postfach": Hier landet der Lieferant, wenn wir auf 'Edit' klicken.
  // Using a writable signal to allow setting via componentInstance (NgbModal pattern)
  supplier = signal<Supplier | undefined>(undefined);

  // 3. FormGroup Keys an das neue Model anpassen (name, vatId, etc.)
  supplierForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addition: new FormControl(''), // Neu im Model
    poBox: new FormControl(''),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('CH', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.email] }),
    phoneNumber: new FormControl(''),
    website: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vatId: new FormControl(''), // Geändert von vatNumber
    conditions: new FormControl(''), // Geändert von paymentConditions
    customerInfo: new FormControl(''), // Geändert von notes
  });

  // 5. Diese Funktion wird automatisch ausgeführt, sobald das Modal geöffnet wird
  ngOnInit() {
    // Wir prüfen: Liegt ein Lieferant im Postfach?
    const currentSupplier = this.supplier();
    if (currentSupplier) {
      // Jetzt müssen wir nur noch diese fertigen Daten ins Formular "patchen"
      this.supplierForm.patchValue(currentSupplier);
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
