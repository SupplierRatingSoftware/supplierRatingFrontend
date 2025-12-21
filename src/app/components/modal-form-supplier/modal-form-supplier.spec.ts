import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormSupplier } from './modal-form-supplier';

describe('ModalFormSupplier', () => {
  let component: ModalFormSupplier;
  let fixture: ComponentFixture<ModalFormSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormSupplier],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormSupplier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
