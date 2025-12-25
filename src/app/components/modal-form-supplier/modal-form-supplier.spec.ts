import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFormSupplierComponent } from './modal-form-supplier';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from '../../models/supplier.model';
import { vi } from 'vitest';

describe('ModalFormSupplierComponent', () => {
  let component: ModalFormSupplierComponent;
  let fixture: ComponentFixture<ModalFormSupplierComponent>;
  let mockActiveModal: { close: ReturnType<typeof vi.fn>; dismiss: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockActiveModal = {
      close: vi.fn(),
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ModalFormSupplierComponent],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormSupplierComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('edit mode functionality', () => {
    const mockSupplier: Supplier = {
      id: 'test-id',
      code: 'test-code',
      name: 'Test Supplier',
      customerNumber: 'CUST123',
      street: 'Test Street 1',
      poBox: 'PO Box 100',
      zipCode: '12345',
      city: 'Test City',
      country: 'Schweiz',
      email: 'test@example.com',
      phoneNumber: '+41 12 345 67 89',
      website: 'https://example.com',
      vatId: 'CHE-123.456.789',
      conditions: '30 Tage netto',
      customerInfo: 'Test notes',
    };

    it('should pre-fill form when supplier signal is set', () => {
      component.supplier.set(mockSupplier);
      component.ngOnInit();

      expect(component.supplierForm.value.fullName).toBe(mockSupplier.name);
      expect(component.supplierForm.value.customerNumber).toBe(mockSupplier.customerNumber);
      expect(component.supplierForm.value.street).toBe(mockSupplier.street);
      expect(component.supplierForm.value.poBox).toBe(mockSupplier.poBox);
      expect(component.supplierForm.value.zipCode).toBe(mockSupplier.zipCode);
      expect(component.supplierForm.value.city).toBe(mockSupplier.city);
      expect(component.supplierForm.value.country).toBe(mockSupplier.country);
      expect(component.supplierForm.value.email).toBe(mockSupplier.email);
      expect(component.supplierForm.value.phoneNumber).toBe(mockSupplier.phoneNumber);
      expect(component.supplierForm.value.website).toBe(mockSupplier.website);
      expect(component.supplierForm.value.vatNumber).toBe(mockSupplier.vatId);
      expect(component.supplierForm.value.paymentConditions).toBe(mockSupplier.conditions);
      expect(component.supplierForm.value.notes).toBe(mockSupplier.customerInfo);
    });

    it('should not pre-fill form when supplier signal is not set', () => {
      component.ngOnInit();

      expect(component.supplierForm.value.fullName).toBe('');
      expect(component.supplierForm.value.customerNumber).toBe('');
      expect(component.supplierForm.value.country).toBe('Schweiz');
    });

    it('should correctly map supplier fields to form fields using SupplierMapper', () => {
      component.supplier.set(mockSupplier);
      component.ngOnInit();

      // Check that the mapper correctly translates field names
      expect(component.supplierForm.value.vatNumber).toBe(mockSupplier.vatId);
      expect(component.supplierForm.value.paymentConditions).toBe(mockSupplier.conditions);
      expect(component.supplierForm.value.notes).toBe(mockSupplier.customerInfo);
    });

    it('should handle suppliers with minimal fields', () => {
      const minimalSupplier: Supplier = {
        id: 'test-id',
        code: 'test-code',
        name: 'Minimal Supplier',
        zipCode: '12345',
        city: 'Test City',
        country: 'Schweiz',
      };

      component.supplier.set(minimalSupplier);
      component.ngOnInit();

      expect(component.supplierForm.value.fullName).toBe(minimalSupplier.name);
      expect(component.supplierForm.value.street).toBe('');
      expect(component.supplierForm.value.email).toBe('');
      expect(component.supplierForm.value.phoneNumber).toBe('');
    });

    it('should call activeModal.close with form value when form is submitted and valid', () => {
      component.supplier.set(mockSupplier);
      component.ngOnInit();

      component.onSubmit();

      expect(mockActiveModal.close).toHaveBeenCalledWith(component.supplierForm.value);
    });

    it('should not call activeModal.close when form is invalid', () => {
      // Create component with empty form (invalid because name is required)
      component.supplierForm.patchValue({ fullName: '' });

      component.onSubmit();

      expect(mockActiveModal.close).not.toHaveBeenCalled();
    });

    it('should call activeModal.dismiss when cancel is called', () => {
      component.cancel();

      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('supplier signal', () => {
    it('should be a writable signal', () => {
      const testSupplier: Supplier = {
        id: 'test-id',
        code: 'test-code',
        name: 'Test',
        zipCode: '12345',
        city: 'Test City',
        country: 'Schweiz',
      };

      component.supplier.set(testSupplier);

      expect(component.supplier()).toEqual(testSupplier);
    });

    it('should be initialized with undefined', () => {
      expect(component.supplier()).toBeUndefined();
    });
  });
});
