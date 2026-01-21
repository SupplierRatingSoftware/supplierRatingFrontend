import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule, X } from 'lucide-angular';
import { FormSection, ORDER_FORM_CONFIG } from '../../models/order.config';
import { OrderDetailDTO } from '../../openapi-gen';

/** We export the interface so that orders.component.ts can find it.
 * We define it to describe the result of the modal action.
 */
export interface OrderEditResult {
  action: 'SAVE' | 'RATE';
  data: Partial<OrderDetailDTO>;
}

@Component({
  selector: 'app-modal-form-order',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, LucideAngularModule],
  templateUrl: './modal-edit-order.html',
  styleUrl: './modal-edit-order.scss',
})
export class ModalEditOrderComponent implements OnInit {
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
   * Preconfigured form configuration of the modal without supplierId field
   * @description A preconfigured form configuration of the modal form-fields and section-headers without supplierId field
   * @protected
   */
  protected readonly config = ORDER_FORM_CONFIG.map(section => ({
    ...section,
    fields: section.fields.filter(field => field.key !== 'supplierId'),
  }));

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
    // first section expanded by default
    if (this.config.length > 0) {
      this.expandedSections.add(this.config[0].sectionTitle);
    }
    // if we have an order, we patch the form
    const orderToEdit = this.order();
    console.log('Modal lädt orderToEdit:', orderToEdit); // Debugging
    if (orderToEdit) {
      this.orderForm.patchValue(orderToEdit);
      // check if the order is already rated
      if (orderToEdit.ratingStatus === 'RATED') {
        this.orderForm.disable();
      }
    }
  }

  /**
   * Checks if errors exist in a form section.
   * @param section The form section to check
   * @returns True if any field in the section is invalid and touched/dirty
   */
  isSectionInvalid(section: FormSection): boolean {
    return section.fields.some(field => {
      const control = this.orderForm.get(field.key);
      return control?.invalid && (control.touched || control.dirty);
    });
  }

  /**
   * Submits the form data if valid.
   */
  onSubmit() {
    if (this.orderForm.valid) {
      console.log('Modal sendet SAVE mit Daten:', this.orderForm.getRawValue()); // Debugging
      // getRawValue makes sure that also disabled fields (e.g. supplierId, if locked) are included.
      this.activeModal.close({ action: 'SAVE', data: this.orderForm.getRawValue() });
    } else {
      this.handleInvalidForm();
    }
  }

  /**
   * Submits the rating data if valid.
   */
  onRate() {
    if (this.orderForm.valid) {
      // getRawValue makes sure that also disabled fields (e.g. supplierId, if locked) are included.
      this.activeModal.close({ action: 'RATE', data: this.orderForm.getRawValue() });
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
