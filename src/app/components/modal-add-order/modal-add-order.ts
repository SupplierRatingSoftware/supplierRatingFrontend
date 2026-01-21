import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule, X } from 'lucide-angular';
import { FormSection, ORDER_FORM_CONFIG } from '../../models/order.config';
import { DefaultService, OrderDetailDTO } from '../../openapi-gen';

/** Exporting the interface so that orders.component.ts can find it.
 * We define it to describe the result of the modal action.
 */
export interface OrderAddResult {
  action: 'SAVE';
  data: Partial<OrderDetailDTO>;
}

@Component({
  selector: 'app-modal-add-order',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, LucideAngularModule],
  templateUrl: './modal-add-order.html',
  styleUrl: './modal-add-order.scss',
})
export class ModalAddOrderComponent implements OnInit {
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
   * Injected supplier service for loading suppliers in the form
   * @private
   */
  private supplierService = inject(DefaultService);

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
  protected readonly config = ORDER_FORM_CONFIG;

  /**
   * State of the order
   * @description The order state is used to store the currently edited order
   */
  order = signal<OrderDetailDTO | undefined>(undefined);

  /**
   * Represents a reactive form group for managing order information.
   * This form group contains controls for various order-related fields,
   * including their business and contact information. It is based on the order configuration.
   */
  protected orderForm: FormGroup = new FormGroup(this.buildFormControls());

  /**
   * Builds the form controls based on the configuration.
   * @private
   * @returns A record of form controls
   */
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
    //openes first section by default
    if (this.config.length > 0) {
      this.expandedSections.add(this.config[0].sectionTitle);
    }

    // loading suppliers and populating dropdown options
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      // Searching for the supplierId field in the config to populate its options
      const section = this.config.find(s => s.sectionTitle === 'Lieferant & Ansprechperson');
      const supplierField = section?.fields.find(f => f.key === 'supplierId');

      if (supplierField) {
        // Mapping suppliers to dropdown options
        supplierField.options = suppliers.map(s => ({
          value: s.id || '', // important: fallback to empty string if id is undefined
          label: s.name, // Name of the supplier is shown
        }));

        // Dropdown options are now populated. Next, we can pre-fill the form if editing an existing order.
        const orderToEdit = this.order();
        if (orderToEdit) {
          this.orderForm.patchValue(orderToEdit);
        }
      }
    });
  }

  /**
   * Checks if errors exist in a form section.
   * @description This method checks if any field within the given section has validation errors.
   * @param section The form section to check for errors.
   * @returns True if any field in the section is invalid, false otherwise.
   */
  isSectionInvalid(section: FormSection): boolean {
    return section.fields.some(field => {
      const control = this.orderForm.get(field.key);
      return control?.invalid && (control.touched || control.dirty);
    });
  }

  /** Submits the form data if valid.
   * Uses getRawValue() to ensure disabled fields (like ID or pre-set Supplier) are included.
   */
  onSubmit() {
    if (this.orderForm.valid) {
      console.log('Modal sendet SAVE mit Daten:', this.orderForm.getRawValue()); // Debugging
      this.activeModal.close({ action: 'SAVE', data: this.orderForm.getRawValue() });
    } else {
      this.handleInvalidForm();
    }
  }

  /**
   * Handles invalid form submission by marking all fields as touched
   * and expanding sections with errors.
   */
  private handleInvalidForm() {
    this.orderForm.markAllAsTouched();
    this.config.forEach(section => {
      if (this.isSectionInvalid(section)) {
        this.expandedSections.add(section.sectionTitle);
      }
    });
  }

  /**
   * Cancels the modal and dismisses it.
   */
  cancel() {
    this.activeModal.dismiss();
  }
}
