/**
 * Interface for the form configuration
 * @description This interface declares the configuration of a form section
 */
export interface FormSection {
  sectionTitle: string;
  fields: FieldMeta[];
}

/**
 * Interface for the fields metadata of the form
 * @description This interface declares the metadata of a form field in a form section
 */
export interface FieldMeta {
  key: string; // Technical name
  label: string; // Displayed name for the UI
  required: boolean;
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'number' | 'date' | 'select';
  options?: SelectOption[]; // List of selectable options
  gridClass?: string; // CSS-Class for the col-width (e.g. 'col-12', 'col-md-6')
  placeholder?: string;
  validationRules?: ('email' | 'url' | 'phone')[]; // Additional validation rules
}

/**
 * Interface for the select options in the fields metadata
 * @description This interface declares the options of a select field in a form section
 */
export interface SelectOption {
  value: string; // Technical name
  label: string; // Displayed name for the UI
}

/**
 * Central configuration for displaying order-form sections
 */
export const ORDER_FORM_CONFIG: FormSection[] = [
  {
    sectionTitle: 'Allgemeine Informationen',
    fields: [
      { key: 'name', label: 'Kurzbezeichnung', required: true, type: 'text', gridClass: 'col-3' },
      { key: 'details', label: 'Details', required: false, type: 'textarea', gridClass: 'col-9' },
      {
        key: 'mainCategory',
        label: 'Hauptkategorie',
        required: true,
        type: 'select',
        gridClass: 'col-md-4',
        options: [
          { value: 'Beschaffung', label: 'Beschaffung' },
          { value: 'Dienstleistung', label: 'Dienstleistung' },
        ],
      },
      {
        key: 'subCategory',
        label: 'Unterkategorie',
        required: true,
        type: 'select',
        gridClass: 'col-md-4',
        options: [
          { value: 'Beratung', label: 'Beratung' },
          { value: 'Dienstleistung', label: 'Dienstleistung' },
          { value: 'Gerät/Werkzeug', label: 'Gerät/Werkzeug' },
          { value: 'Maschine', label: 'Maschine' },
          { value: 'Messgeräte', label: 'Messgerät' },
          { value: 'Messmittel', label: 'Messmittel' },
          { value: 'PC Hardware', label: 'PC Hardware' },
          { value: 'PC Software', label: 'PC Software' },
          { value: 'Prüfmaschine', label: 'Prüfmaschine' },
        ],
      },
      { key: 'frequency', label: 'Rhythmus der Bestellung', required: false, type: 'text', gridClass: 'col-4' },
      { key: 'reason', label: 'Grund der Bestellung', required: true, type: 'text', gridClass: 'col-12' },
    ],
  },
  {
    sectionTitle: 'Logistik & Termine',
    fields: [
      { key: 'orderedBy', label: 'Bestellt von', required: true, type: 'text', gridClass: 'col-6' },
      { key: 'orderMethod', label: 'Bestellweg', required: false, type: 'text', gridClass: 'col-6' },
      { key: 'orderDate', label: 'Bestelldatum', required: true, type: 'date', gridClass: 'col-6' },
      { key: 'deliveryDate', label: 'Lieferdatum', required: false, type: 'date', gridClass: 'col-6' },
    ],
  },
  {
    sectionTitle: 'Lieferant & Ansprechperson',
    fields: [
      {
        key: 'supplierId',
        label: 'Lieferant',
        required: true,
        type: 'select',
        gridClass: 'col-6',
        options: [], // options will be populated dynamically
      },
      { key: 'contactPerson', label: 'Name der Ansprechperson', required: false, type: 'text', gridClass: 'col-6' },
      {
        key: 'contactEmail',
        label: 'E-Mail der Ansprechperson',
        required: false,
        type: 'email',
        gridClass: 'col-6',
        validationRules: ['email'], // validation rule defined centrally
      },
      { key: 'contactPhone', label: 'Telefon der Ansprechperson', required: false, type: 'text', gridClass: 'col-6' },
      {
        key: 'orderComment',
        label: 'Kommentar zur Bestellung',
        required: false,
        type: 'textarea',
        gridClass: 'col-12',
      },
    ],
  },
];
