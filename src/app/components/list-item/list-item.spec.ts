import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItem } from './list-item';
import { User } from 'lucide-angular';

describe('ListItem', () => {
  let component: ListItem;
  let fixture: ComponentFixture<ListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ListItem);
    component = fixture.componentInstance;
    // Set required inputs
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('icon', User);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('output events', () => {
    it('should emit itemSelected when showContent is called', () => {
      let emitted = false;
      component.itemSelected.subscribe(() => {
        emitted = true;
      });

      component['showContent']();

      expect(emitted).toBe(true);
    });

    it('should emit editSelected when editContent is called', () => {
      let emitted = false;
      component.editSelected.subscribe(() => {
        emitted = true;
      });

      component['editContent']();

      expect(emitted).toBe(true);
    });

    it('should emit itemSelected when list item button is clicked', () => {
      let emitted = false;
      component.itemSelected.subscribe(() => {
        emitted = true;
      });

      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="button"]:not(#editBtn)');
      button.click();

      expect(emitted).toBe(true);
    });

    it('should emit editSelected when edit button is clicked', () => {
      let emitted = false;
      component.editSelected.subscribe(() => {
        emitted = true;
      });

      fixture.detectChanges();
      const editButton = fixture.nativeElement.querySelector('#editBtn');
      editButton.click();

      expect(emitted).toBe(true);
    });
  });
});
