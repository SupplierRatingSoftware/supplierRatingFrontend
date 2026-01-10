import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule, X } from 'lucide-angular';
import { FormSection } from '../../models/rating.model';
import { RATING_FORM_CONFIG } from '../../models/rating.config';
import { RatingService } from '../../services/rating.service';
import { Order } from '../../models/order.model';
import { ToastComponent } from '../toast/toast.component';

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
   * Injected rating service for loading ratings in the form
   * @private
   */
  private ratingService = inject(RatingService);

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
  order = signal<Order | undefined>(undefined);

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
    // 1. Zuerst die konditionale Sperrung (basierend auf Kontaktperson) anwenden
    this.applyConditionalValidators();
    // 2. Bestehende Bewertungen laden (falls vorhanden)
    const currentRating = this.order(); //?.orderRating;
    if (currentRating) {
      this.ratingForm.patchValue(currentRating);
    }

    // NEU: Wenn der Status bereits 'RATED' ist, das Formular sperren
    if (this.order()?.ratingStatus === 'RATED') {
      this.ratingForm.disable(); // Deaktiviert alle Controls (Sterne, Textareas)
    }
  }

  private applyConditionalValidators() {
    const hasContactPerson = !!this.order()?.contactPerson; //

    // Wir gehen generisch durch alle Sektionen und Felder der Konfiguration
    this.config.forEach(section => {
      section.fields.forEach(field => {
        // Wir prüfen nur Felder, die das Flag 'requiredIfContact' haben
        if (field.requiredIfContact) {
          const control = this.ratingForm.get(field.key);

          if (control) {
            if (hasContactPerson) {
              // FALL 1: Kontaktperson vorhanden -> Feld aktivieren und Validierung setzen
              control.enable();
              const validators: ValidatorFn[] = [Validators.required];
              if (field.type === 'rating') validators.push(Validators.min(1));
              control.setValidators(validators);
            } else {
              // FALL 2: Keine Kontaktperson -> Feld komplett deaktivieren
              control.disable();
              control.clearValidators();

              // WICHTIG: Wert zurücksetzen, damit alte Eingaben
              // nicht die Berechnung des totalScore beeinflussen
              control.setValue(field.type === 'rating' ? 0 : '');
            }

            // Angular mitteilen, dass sich der Status des Feldes geändert hat
            control.updateValueAndValidity();
          }
        }
      });
    });
  }

  /**
   * Checks if errors exist in a form section.
   */
  isSectionInvalid(section: FormSection): boolean {
    return section.fields.some(field => {
      const control = this.ratingForm.get(field.key);
      return control?.invalid && (control.touched || control.dirty);
    });
  }

  /**
   * Handles form submission and closes the modal with the form data if valid.
   */
  //todo: totalScore berechnen
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

  onToastClosed() {
    this.message.set(null);
    this.warningConfirmed.set(true); // User hat die Warnung weggeklickt
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
