import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule, X } from 'lucide-angular';
import { FormSection, ORDER_FORM_CONFIG } from '../../models/order.config';
import { DefaultService, OrderSummaryDTO } from '../../openapi-gen';

@Component({
  selector: 'app-modal-form-order',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, LucideAngularModule],
  templateUrl: './modal-form-order.html',
  styleUrl: './modal-form-order.scss',
})
export class ModalFormOrderComponent implements OnInit {
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
  order = signal<OrderSummaryDTO | undefined>(undefined);

  /**
   * Represents a reactive form group for managing order information.
   * This form group contains controls for various order-related fields,
   * including their business and contact information. It is based on the order configuration.
   */
  protected orderForm: FormGroup = new FormGroup(this.buildFormControls());

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
   * AKTION: "Bestellung bewerten"
   * Schließt das Modal und signalisiert der Page, dass das Rating-Modal folgen soll.
   */
  onRate() {
    if (this.orderForm.valid) {
      this.activeModal.close({ action: 'RATE', data: this.orderForm.value });
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * For handling form initialization and data pre-filling
   */
  ngOnInit() {
    this.loadSuppliers();
    // Expand the first section by default, if there are sections
    if (this.config.length > 0) {
      this.expandedSections.add(this.config[0].sectionTitle);
    }
    // Load suppliers and map them to the form options
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      const supplierField = this.config
        .find(s => s.sectionTitle === 'Lieferant & Ansprechperson')
        ?.fields.find(f => f.key === 'supplier');
      if (supplierField) {
        supplierField.options = suppliers.map(s => ({ value: s.id || '', label: s.name }));
      }
    });
    // Check if an order is present
    const currentOrder = this.order();
    if (currentOrder) {
      // Patching the data into the form
      this.orderForm.patchValue(currentOrder);
      // If the order is already rated, disable the form
      if (currentOrder.ratingStatus === 'RATED') {
        this.orderForm.disable();
      }
    }
  }

  /**
   * Loads suppliers from the SupplierService and maps them to the select options
   * in the form configuration.
   */
  private loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      // Find the section with the title "Lieferant & Ansprechperson"
      const section = this.config.find(s => s.sectionTitle === 'Lieferant & Ansprechperson');
      // Find the field with the key 'supplierId' in that section
      const supplierField = section?.fields.find(f => f.key === 'supplierId');
      // Map suppliers to the field options {value, label}
      if (supplierField) {
        supplierField.options = suppliers.map(s => ({
          value: s.id || '', // Die technische ID
          label: s.name, // Der Anzeigename für das Dropdown
        }));
      }
    });
  }

  /**
   * Checks if errors exist in a form section.
   */
  isSectionInvalid(section: FormSection): boolean {
    return section.fields.some(field => {
      const control = this.orderForm.get(field.key);
      return control?.invalid && (control.touched || control.dirty);
    });
  }

  /**
   * Handles form submission and closes the modal with the form data if valid.
   */
  onSubmit() {
    if (this.orderForm.valid) {
      this.activeModal.close(this.orderForm.value);
    } else {
      // Mark all fields as touched to display validation messages
      this.orderForm.markAllAsTouched();

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
