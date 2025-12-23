import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

// Interface bleibt gleich
export interface OrderFormData {
  shortName: string;
  details: string;
  mainCategory: string;
  subCategory: string;
  rhythm: string;
  reason: string;
  orderer: string;
  orderType: string;
  orderDate: string;
  deliveryDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactComment: string;
  ratingQuality: number;
  commentQuality: string;
  ratingCost: number;
  commentCost: string;
  ratingDeadline: number;
  commentDeadline: string;
  ratingAvailability: number;
  commentAvailability: string;
  totalComment: string;
}

@Component({
  selector: 'app-modal-form-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, NgbRatingModule],
  templateUrl: './modal-form-order.html',
  styleUrl: './modal-form-order.scss',
})
export class ModalFormOrderComponent {
  activeModal = inject(NgbActiveModal);

  orderForm = new FormGroup({
    shortName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    details: new FormControl('', { nonNullable: true }),
    mainCategory: new FormControl('', { nonNullable: true }),
    subCategory: new FormControl('', { nonNullable: true }),
    rhythm: new FormControl('', { nonNullable: true }),
    reason: new FormControl('', { nonNullable: true }),
    orderer: new FormControl('', { nonNullable: true }),
    orderType: new FormControl('', { nonNullable: true }),
    orderDate: new FormControl('', { nonNullable: true }),
    deliveryDate: new FormControl('', { nonNullable: true }),
    contactName: new FormControl('', { nonNullable: true }),
    contactEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    contactPhone: new FormControl('', { nonNullable: true }),
    contactComment: new FormControl('', { nonNullable: true }),
    ratingQuality: new FormControl(0, { nonNullable: true }),
    commentQuality: new FormControl('', { nonNullable: true }),
    ratingCost: new FormControl(0, { nonNullable: true }),
    commentCost: new FormControl('', { nonNullable: true }),
    ratingDeadline: new FormControl(0, { nonNullable: true }),
    commentDeadline: new FormControl('', { nonNullable: true }),
    ratingAvailability: new FormControl(0, { nonNullable: true }),
    commentAvailability: new FormControl('', { nonNullable: true }),
    totalComment: new FormControl('', { nonNullable: true }),
  });

  protected formValues = toSignal(this.orderForm.valueChanges.pipe(startWith(this.orderForm.getRawValue())));

  totalRating = computed(() => {
    const val = this.formValues();
    if (!val) return '0.0/5';
    const ratings = [val.ratingQuality, val.ratingCost, val.ratingDeadline, val.ratingAvailability].filter(
      (v): v is number => v !== undefined && v > 0
    );
    if (ratings.length === 0) return '0.0/5';
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    return `${(sum / ratings.length).toFixed(1)}/5`;
  });

  onSubmit() {
    if (this.orderForm.valid) {
      this.activeModal.close(this.orderForm.value);
    } else {
      // WICHTIG: Markiert alle Felder, damit die roten Fehlermeldungen erscheinen
      this.orderForm.markAllAsTouched();
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
