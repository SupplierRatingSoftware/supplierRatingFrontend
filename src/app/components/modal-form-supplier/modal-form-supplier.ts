import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
   */
  protected supplierForm: FormGroup = new FormGroup(this.buildFormControls());

  private buildFormControls(): Record<string, AbstractControl> {
    const group: Record<string, AbstractControl> = {};
    this.config.forEach(section => {
      section.fields.forEach(field => {
        const validators = field.required ? [Validators.required] : [];
        if (field.validationRules?.includes('email')) validators.push(Validators.email);

        group[field.key] = new FormControl('', {
          nonNullable: field.required,
          validators: validators,
        });
      });
    });
    return group;
  }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * For handling form initialization and data pre-filling
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
