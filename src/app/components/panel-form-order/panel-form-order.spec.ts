import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFormOrder } from './panel-form-order';

describe('PanelFormOrder', () => {
  let component: PanelFormOrder;
  let fixture: ComponentFixture<PanelFormOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelFormOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelFormOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
