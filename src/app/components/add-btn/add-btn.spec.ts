import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBtn } from './add-btn';

describe('AddBtn', () => {
  let component: AddBtn;
  let fixture: ComponentFixture<AddBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBtn],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
