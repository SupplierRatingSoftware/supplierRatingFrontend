import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule, X } from 'lucide-angular';
import { FormSection, RATING_FORM_CONFIG } from '../../models/rating.config';
import { ToastComponent } from '../toast/toast.component';
import { OrderDetailDTO } from '../../openapi-gen';

@Component({
  selector: 'app-modal-rating',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbRatingModule,
    NgbAccordionModule,
    LucideAngularModule,
    ToastComponent,
  ],
  templateUrl: './modal-rating.html',
  styleUrl: './modal-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalRatingComponent implements OnInit {
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
  protected readonly config = RATING_FORM_CONFIG;

  /**
   * State of the order
   * @description The order state is used to store the currently edited order
   */
  order = signal<OrderDetailDTO | undefined>(undefined);

  // Toast message state
  message = signal<string | null>(null);

  // Tracker for whether the warning has been confirmed
  warningConfirmed = signal<boolean>(false); // NEU: Tracker für die Bestätigung

  /**
   * Represents a reactive form group for managing rating information.
   * This form group contains controls for various rating-related fields,
   * including their business and contact information. It is based on the rating configuration.
   */
  protected ratingForm: FormGroup = new FormGroup(this.buildFormControls());

  /** * Builds the form controls based on the rating configuration.
   * @returns A record of form controls keyed by their field names.
   * @private
   */
  private buildFormControls(): Record<string, AbstractControl> {
    const group: Record<string, AbstractControl> = {};
    this.config.forEach(section => {
      section.fields.forEach(field => {
        const validators = field.required ? [Validators.required] : [];
        group[field.key] = new FormControl('', {
          nonNullable: field.required,
          validators: validators,
        });
      });
    });
    return group;
  }

  /** Calculates the total score from individual rating fields.
   * @returns The total score as a number.
   */
  ngOnInit() {
    // Expand all sections by default
    this.config.forEach(section => this.expandedSections.add(section.sectionTitle));

    // Apply conditional locking (based on contact person)
    this.applyConditionalValidators();

    // Start automatic calculation (NEWLY ADDED)
    this.setupAutoCalculation();

    // Load existing ratings (if available)
    const currentRating = this.order();
    if (currentRating) {
      this.ratingForm.patchValue(currentRating);
    }

    // When the status is already 'RATED', disable the form
    if (this.order()?.ratingStatus === 'RATED') {
      this.ratingForm.disable();
    }
  }

  /**
   * Subscribe to changes in the rating fields and recalculate the average.
   * @private
   */
  private setupAutoCalculation() {
    // Listen for any change in the form
    this.ratingForm.valueChanges.subscribe(() => {
      this.calculateTotalScore();
    });
  }

  /**
   * Calculate the average value of the active rating fields
   * and update the 'totalScore' field accordingly.
   * @private
   */
  private calculateTotalScore() {
    // List of fields that contribute to the average
    // (These keys must match your rating configuration)
    const ratingKeys = ['quality', 'cost', 'reliability', 'availability'];

    let sum = 0;
    let count = 0;

    ratingKeys.forEach(key => {
      const control = this.ratingForm.get(key);
      // Only count if field exists, is enabled, and has a positive value
      if (control && control.enabled && Number(control.value) > 0) {
        sum += Number(control.value);
        count++;
      }
    });

    const average = count > 0 ? sum / count : 0;

    // Set the value in the 'totalScore' field without triggering a new event loop
    const totalControl = this.ratingForm.get('totalScore');
    if (totalControl) {
      // Save the exact value, the pipe in HTML takes care of display
      totalControl.setValue(average, { emitEvent: false });
    }
  }

  /**
   * Applies conditional validators based on the presence of a contact person in the order.
   * If a contact person exists, certain fields are enabled and marked as required.
   * If no contact person exists, those fields are disabled and cleared of validators.
   * Additionally, fields are reset to default values to prevent old inputs from affecting calculations.
   * @private
   */
  private applyConditionalValidators() {
    const hasContactPerson = !!this.order()?.contactPerson; //

    // Iterate through all sections and fields in the configuration
    this.config.forEach(section => {
      section.fields.forEach(field => {
        // Only check fields with the 'requiredIfContact' flag
        if (field.requiredIfContact) {
          const control = this.ratingForm.get(field.key);

          if (control) {
            if (hasContactPerson) {
              // Case 1: ContactPerson exists -> activate and set validation
              control.enable();
              const validators: ValidatorFn[] = [Validators.required];
              if (field.type === 'rating') validators.push(Validators.min(1));
              control.setValidators(validators);
            } else {
              // Case 2: No ContactPerson -> completely disable field
              control.disable();
              control.clearValidators();

              // IMPORTANT: Reset value to prevent old inputs from affecting totalScore calculation
              control.setValue(field.type === 'rating' ? 0 : '');
            }

            // Inform Angular about the field status change
            control.updateValueAndValidity();
          }
        }
      });
    });
  }

  /**
   * Checks if errors exist in a form section.
   * @param section The form section to check.
   * @returns True if any field in the section is invalid and touched/dirty, false otherwise.
   */
  isSectionInvalid(section: FormSection): boolean {
    return section.fields.some(field => {
      const control = this.ratingForm.get(field.key);
      return control?.invalid && (control.touched || control.dirty);
    });
  }

  /**
   * Handles form submission and closes the modal with the form data if valid.
   * If the form is invalid, it marks all fields as touched to display validation messages
   * and expands any sections containing invalid fields.
   */
  onSubmit() {
    if (this.ratingForm.valid) {
      this.activeModal.close(this.ratingForm.value);
    } else {
      // Mark all fields as touched to display validation messages
      this.ratingForm.markAllAsTouched();

      // Push all invalid sections to the expandedSections set -> these sections will expand
      this.config.forEach(section => {
        if (this.isSectionInvalid(section)) {
          this.expandedSections.add(section.sectionTitle);
        }
      });
    }
  }

  /** Handles the closing of the toast message.
   * Resets the message state and marks the warning as confirmed.
   */
  onToastClosed() {
    this.message.set(null);
    this.warningConfirmed.set(true); // User has dismissed the warning
  }

  /** Cancels the modal without saving changes.
   * Dismisses the active modal.
   */
  cancel() {
    this.activeModal.dismiss();
  }
}
