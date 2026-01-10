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
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'number' | 'select';
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
 * Central configuration for displaying supplier-form sections
 */
export const SUPPLIER_FORM_CONFIG: FormSection[] = [
  {
    sectionTitle: 'Lieferanten Details',
    fields: [
      { key: 'name', label: 'Firmenname', required: true, type: 'text', gridClass: 'col-md-6' },
      { key: 'customerNumber', label: 'Kundennummer', required: true, type: 'text', gridClass: 'col-md-5' },
    ],
  },
  {
    sectionTitle: 'Adresse & Standort',
    fields: [
      { key: 'street', label: 'Strasse & Nr.', required: true, type: 'text', gridClass: 'col-md-6' },
      { key: 'addition', label: 'Zusatz', required: false, type: 'text', gridClass: 'col-md-4' },
      { key: 'poBox', label: 'Postfach', required: false, type: 'text', gridClass: 'col-md-6' },
      { key: 'zipCode', label: 'PLZ', required: true, type: 'text', gridClass: 'col-md-4' },
      { key: 'city', label: 'Ort', required: true, type: 'text', gridClass: 'col-md-6' },
      {
        key: 'country',
        label: 'Land',
        required: true,
        type: 'select', // Geändert von 'text' zu 'select'
        gridClass: 'col-md-6',
        options: [
          { value: 'CH', label: 'Schweiz' },
          { value: 'D', label: 'Deutschland' },
          { value: 'F', label: 'Frankreich' },
          { value: 'NL', label: 'Niederlande' },
          { value: 'FL', label: 'Liechtenstein' },
        ],
      },
    ],
  },
  {
    sectionTitle: 'Kontakt & Web',
    fields: [
      {
        key: 'email',
        label: 'E-Mail',
        required: false,
        type: 'email',
        gridClass: 'col-md-6',
        validationRules: ['email'], // Hier definieren wir die Regel zentral
      },
      { key: 'phoneNumber', label: 'Telefon', required: false, type: 'tel', gridClass: 'col-md-6' },
      { key: 'website', label: 'Website', required: false, type: 'url', gridClass: 'col-12' },
    ],
  },
  {
    sectionTitle: 'Konditionen & Info',
    fields: [
      { key: 'vatId', label: 'MWST-Nummer (VAT)', required: true, type: 'text', gridClass: 'col-md-6' },
      { key: 'conditions', label: 'Konditionen', required: true, type: 'textarea', gridClass: 'col-md-6' },
      { key: 'customerInfo', label: 'Interne Info', required: false, type: 'textarea', gridClass: 'col-12' },
    ],
  },
];
