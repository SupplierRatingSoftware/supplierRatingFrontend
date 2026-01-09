import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRating } from './modal-rating';

describe('ModalRating', () => {
  let component: ModalRating;
  let fixture: ComponentFixture<ModalRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
