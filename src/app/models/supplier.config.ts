import { FormSection } from './supplier.model';

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
          { value: 'DE', label: 'Deutschland' },
          { value: 'AT', label: 'Österreich' },
          { value: 'LI', label: 'Liechtenstein' },
          { value: 'FR', label: 'Frankreich' },
          { value: 'IT', label: 'Italien' },
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
      { key: 'website', label: 'Website', required: true, type: 'url', gridClass: 'col-12' },
    ],
  },
  {
    sectionTitle: 'Konditionen & Info',
    fields: [
      { key: 'vatId', label: 'MWST-Nummer (VAT)', required: false, type: 'text', gridClass: 'col-md-6' },
      { key: 'conditions', label: 'Konditionen', required: false, type: 'textarea', gridClass: 'col-md-6' },
      { key: 'customerInfo', label: 'Interne Info', required: false, type: 'textarea', gridClass: 'col-12' },
    ],
  },
];
