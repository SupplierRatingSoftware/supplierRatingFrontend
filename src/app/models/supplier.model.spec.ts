import { Supplier, SupplierFormData, SupplierMapper } from './supplier.model';

describe('SupplierMapper', () => {
  describe('mapFormToSupplier', () => {
    const mockFormData: SupplierFormData = {
      fullName: 'Test Supplier',
      customerNumber: 'CUST123',
      street: 'Test Street 1',
      poBox: 'PO Box 100',
      zipCode: '12345',
      city: 'Test City',
      country: 'Schweiz',
      email: 'test@example.com',
      phoneNumber: '+41 12 345 67 89',
      website: 'https://example.com',
      vatNumber: 'CHE-123.456.789',
      paymentConditions: '30 Tage netto',
      notes: 'Test notes',
    };

    it('should map form data to supplier with provided id and code', () => {
      const result = SupplierMapper.mapFormToSupplier(mockFormData, 'test-id', 'test-code');

      expect(result.id).toBe('test-id');
      expect(result.code).toBe('test-code');
      expect(result.name).toBe(mockFormData.fullName);
      expect(result.customerNumber).toBe(mockFormData.customerNumber);
      expect(result.street).toBe(mockFormData.street);
      expect(result.poBox).toBe(mockFormData.poBox);
      expect(result.zipCode).toBe(mockFormData.zipCode);
      expect(result.city).toBe(mockFormData.city);
      expect(result.country).toBe(mockFormData.country);
      expect(result.email).toBe(mockFormData.email);
      expect(result.phoneNumber).toBe(mockFormData.phoneNumber);
      expect(result.website).toBe(mockFormData.website);
      expect(result.vatId).toBe(mockFormData.vatNumber);
      expect(result.conditions).toBe(mockFormData.paymentConditions);
      expect(result.customerInfo).toBe(mockFormData.notes);
    });

    it('should map form data to supplier with empty id and code when not provided', () => {
      const result = SupplierMapper.mapFormToSupplier(mockFormData);

      expect(result.id).toBe('');
      expect(result.code).toBe('');
      expect(result.name).toBe(mockFormData.fullName);
    });

    it('should correctly map field names (vatNumber -> vatId, paymentConditions -> conditions, notes -> customerInfo)', () => {
      const result = SupplierMapper.mapFormToSupplier(mockFormData, 'id', 'code');

      expect(result.vatId).toBe(mockFormData.vatNumber);
      expect(result.conditions).toBe(mockFormData.paymentConditions);
      expect(result.customerInfo).toBe(mockFormData.notes);
    });
  });

  describe('mapSupplierToForm', () => {
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

    it('should map supplier to form data', () => {
      const result = SupplierMapper.mapSupplierToForm(mockSupplier);

      expect(result.fullName).toBe(mockSupplier.name);
      expect(result.customerNumber).toBe(mockSupplier.customerNumber);
      expect(result.street).toBe(mockSupplier.street);
      expect(result.poBox).toBe(mockSupplier.poBox);
      expect(result.zipCode).toBe(mockSupplier.zipCode);
      expect(result.city).toBe(mockSupplier.city);
      expect(result.country).toBe(mockSupplier.country);
      expect(result.email).toBe(mockSupplier.email);
      expect(result.phoneNumber).toBe(mockSupplier.phoneNumber);
      expect(result.website).toBe(mockSupplier.website);
      expect(result.vatNumber).toBe(mockSupplier.vatId);
      expect(result.paymentConditions).toBe(mockSupplier.conditions);
      expect(result.notes).toBe(mockSupplier.customerInfo);
    });

    it('should handle optional fields with fallback to empty strings', () => {
      const minimalSupplier: Supplier = {
        id: 'test-id',
        code: 'test-code',
        name: 'Test Supplier',
        zipCode: '12345',
        city: 'Test City',
        country: 'Schweiz',
      };

      const result = SupplierMapper.mapSupplierToForm(minimalSupplier);

      expect(result.customerNumber).toBe('');
      expect(result.street).toBe('');
      expect(result.poBox).toBe('');
      expect(result.email).toBe('');
      expect(result.phoneNumber).toBe('');
      expect(result.website).toBe('');
      expect(result.vatNumber).toBe('');
      expect(result.paymentConditions).toBe('');
      expect(result.notes).toBe('');
    });

    it('should default country to "Schweiz" when not provided', () => {
      const supplierWithoutCountry: Supplier = {
        id: 'test-id',
        code: 'test-code',
        name: 'Test Supplier',
        zipCode: '12345',
        city: 'Test City',
        country: '',
      };

      const result = SupplierMapper.mapSupplierToForm(supplierWithoutCountry);

      expect(result.country).toBe('Schweiz');
    });

    it('should correctly map field names (vatId -> vatNumber, conditions -> paymentConditions, customerInfo -> notes)', () => {
      const result = SupplierMapper.mapSupplierToForm(mockSupplier);

      expect(result.vatNumber).toBe(mockSupplier.vatId);
      expect(result.paymentConditions).toBe(mockSupplier.conditions);
      expect(result.notes).toBe(mockSupplier.customerInfo);
    });
  });

  describe('bidirectional mapping', () => {
    it('should maintain data integrity when mapping form -> supplier -> form', () => {
      const originalFormData: SupplierFormData = {
        fullName: 'Test Supplier',
        customerNumber: 'CUST123',
        street: 'Test Street 1',
        poBox: 'PO Box 100',
        zipCode: '12345',
        city: 'Test City',
        country: 'Schweiz',
        email: 'test@example.com',
        phoneNumber: '+41 12 345 67 89',
        website: 'https://example.com',
        vatNumber: 'CHE-123.456.789',
        paymentConditions: '30 Tage netto',
        notes: 'Test notes',
      };

      const supplier = SupplierMapper.mapFormToSupplier(originalFormData, 'id', 'code');
      const resultFormData = SupplierMapper.mapSupplierToForm(supplier);

      expect(resultFormData).toEqual(originalFormData);
    });

    it('should maintain data integrity when mapping supplier -> form -> supplier', () => {
      const originalSupplier: Supplier = {
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

      const formData = SupplierMapper.mapSupplierToForm(originalSupplier);
      const resultSupplier = SupplierMapper.mapFormToSupplier(formData, originalSupplier.id, originalSupplier.code);

      expect(resultSupplier).toEqual(originalSupplier);
    });
  });
});
