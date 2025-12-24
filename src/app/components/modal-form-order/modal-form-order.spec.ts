import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormOrderComponent } from './modal-form-order';

describe('ModalFormOrderComponent', () => {
  let component: ModalFormOrderComponent;
  let fixture: ComponentFixture<ModalFormOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormOrderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
