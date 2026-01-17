import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemHeadersComponent } from './list-item-headers.component';

describe('ListItemHeaders', () => {
  let component: ListItemHeadersComponent;
  let fixture: ComponentFixture<ListItemHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemHeadersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListItemHeadersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
