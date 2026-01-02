import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormSection, Supplier } from '../../models/supplier.model';
import { SUPPLIER_FORM_CONFIG } from '../../models/supplier.config';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal-form-supplier',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, LucideAngularModule],
  templateUrl: './modal-form-supplier.html',
  styleUrl: './modal-form-supplier.scss',
})
export class ModalFormSupplierComponent implements OnInit {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly X = X;

  /**
   * Injected NgbActiveModal
   * @private
   */
  private activeModal = inject(NgbActiveModal);

  /**
   * We declare the Set to store the titles of the open sections.
   * @protected
   */
  protected expandedSections = new Set<string>();

  /**
   * Preconfigured form configuration of the modal
   * @description A preconfigured form configuration of the modal form-fields and section-headers
   * @protected
   */
  protected readonly config = SUPPLIER_FORM_CONFIG;

  /**
   * State of the supplier
   * @description The supplier state is used to store the currently edited supplier
   */
  supplier = signal<Supplier | undefined>(undefined);

  /**
   * Represents a reactive form group for managing supplier information.
   * This form group contains controls for various supplier-related fields,
   * including their business and contact information.
   *
   * Fields:
   * - `name`: A required field representing the supplier's name.
   * - `customerNumber`: A required field for the unique customer number associated with the supplier.
   * - `street`: A required field representing the street address of the supplier.
   * - `addition`: An optional field for additional address information.
   * - `poBox`: An optional field for the supplier's PO Box.
   * - `zipCode`: A required field for the postal code of the supplier's address.
   * - `city`: A required field representing the city of the supplier's address.
   * - `country`: A required field for the country of the supplier, with a default value of 'CH'.
   * - `email`: An optional field for the supplier's email address, with validation to ensure it is in a valid email format.
   * - `phoneNumber`: An optional field for the supplier's phone number.
   * - `website`: A required field for the supplier's website URL.
   * - `vatId`: An optional field for the supplier's VAT (Value Added Tax) identification number.
   * - `conditions`: An optional field for storing terms and conditions related to the supplier.
   * - `customerInfo`: An optional field for storing additional customer information related to the supplier.
   */
  supplierForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addition: new FormControl(''),
    poBox: new FormControl(''),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('CH', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.email] }),
    phoneNumber: new FormControl(''),
    website: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vatId: new FormControl(''),
    conditions: new FormControl(''),
    customerInfo: new FormControl(''),
  });

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit() {
    // Expand the first section by default, if there are sections
    if (this.config.length > 0) {
      this.expandedSections.add(this.config[0].sectionTitle);
    }
    // Check if a supplier is present
    const currentSupplier = this.supplier();
    if (currentSupplier) {
      // Patching the data into the form
      this.supplierForm.patchValue(currentSupplier);
    }
  }

  /**
   * Checks if errors exist in a form section.
   */
  isSectionInvalid(section: FormSection): boolean {
    return section.fields.some(field => {
      const control = this.supplierForm.get(field.key);
      return control?.invalid && (control.touched || control.dirty);
    });
  }

  /**
   * Handles form submission and closes the modal with the form data if valid.
   */
  onSubmit() {
    if (this.supplierForm.valid) {
      this.activeModal.close(this.supplierForm.value);
    } else {
      // Mark all fields as touched to display validation messages
      this.supplierForm.markAllAsTouched();

      // Push all invalid sections to the expandedSections set -> these sections will expand
      this.config.forEach(section => {
        if (this.isSectionInvalid(section)) {
          this.expandedSections.add(section.sectionTitle);
        }
      });
    }
  }

  /**
   * Cancels the modal and dismisses it.
   */
  cancel() {
    this.activeModal.dismiss();
  }
}
