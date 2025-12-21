import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormOrder } from './modal-form-order';

describe('ModalFormOrder', () => {
  let component: ModalFormOrder;
  let fixture: ComponentFixture<ModalFormOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
