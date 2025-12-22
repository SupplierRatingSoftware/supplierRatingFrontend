import { Component, inject } from '@angular/core'; // inject ist modern in Angular 21
import { CommonModule } from '@angular/common';
// ReactiveFormsModule: Das "Gehirn" für moderne Angular-Formulare
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// NgbAccordionModule: Das Werkzeug für das Auf- und Zuklappen
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // NgbActiveModal hinzugefügt

@Component({
  selector: 'app-modal-form-supplier',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule],
  templateUrl: './modal-form-supplier.html',
  styleUrl: './modal-form-supplier.scss',
})
export class ModalFormSupplierComponent {
  // Das hier ist wie die Fernbedienung für das Fenster selbst
  activeModal = inject(NgbActiveModal);

  // Wir erstellen eine Gruppe (FormGroup), die alle Felder bündelt
  supplierForm = new FormGroup({
    // Ein FormControl ist ein einzelnes Eingabefeld
    // Validators.required = Pflichtfeld
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    //Felder für den Abschnitt 2 Anschrift
    street: new FormControl(''),
    poBox: new FormControl(''),
    zipCode: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl('Schweiz'), // Standardwert 'Schweiz'
    // Abschnitt 3: Kontakt & Web
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    website: new FormControl(''),
    // Abschnitt 4: Kundeninformation
    vatNumber: new FormControl(''),
    paymentConditions: new FormControl(''),
    notes: new FormControl(''),
  });

  // Diese Funktion wird aufgerufen, wenn man auf "Speichern" klickt
  onSubmit() {
    if (this.supplierForm.valid) {
      console.log('Speichern...', this.supplierForm.value);
      // .close() schliesst das Fenster und schickt die Daten an die SuppliersComponent zurück
      this.activeModal.close(this.supplierForm.value);
    }
  }
  //Diese Funktion schliesst das Fenster, ohne Daten zu speichern
  cancel() {
    // .dismiss() bedeutet "Abbrechen". Es wird kein Ergebnis zurückgegeben.
    this.activeModal.dismiss();
  }
}
