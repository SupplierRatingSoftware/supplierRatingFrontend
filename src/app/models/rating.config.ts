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
  requiredIfContact?: boolean;
  type: 'textarea' | 'number' | 'rating' | 'stat-total';
  gridClass?: string; // CSS-Class for the col-width (e.g. 'col-12', 'col-md-6')
  placeholder?: string;
}

/**
 * Central configuration for displaying order-form sections
 */
export const RATING_FORM_CONFIG: FormSection[] = [
  {
    sectionTitle: 'Bewertung',
    fields: [
      { key: 'quality', label: 'Qualität', required: true, type: 'rating', gridClass: 'col-md-6' },
      {
        key: 'qualityReason',
        label: 'Begründung Qualität',
        required: true,
        type: 'textarea',
        gridClass: 'col-6',
      },
      { key: 'cost', label: 'Kosten', required: true, type: 'rating', gridClass: 'col-md-6' },
      { key: 'costReason', label: 'Begründung Kosten', required: true, type: 'textarea', gridClass: 'col-6' },
      { key: 'reliability', label: 'Termintreue', required: true, type: 'rating', gridClass: 'col-md-6' },
      {
        key: 'reliabilityReason',
        label: 'Begründung Termintreue',
        required: true,
        type: 'textarea',
        gridClass: 'col-6',
      },
      {
        key: 'availability',
        label: 'Verfügbarkeit Ansprechperson',
        required: false,
        requiredIfContact: true,
        type: 'rating',
        gridClass: 'col-md-6',
      },
      {
        key: 'availabilityReason',
        label: 'Begründung Verfügbarkeit',
        required: false,
        requiredIfContact: true,
        type: 'textarea',
        gridClass: 'col-6',
      },
      {
        key: 'totalScore',
        label: 'Ergebnis Gesamtbewertung',
        required: false,
        type: 'stat-total',
        gridClass: 'col-md-6',
      },
      {
        key: 'ratingComment',
        label: 'Kommentar zur Bewertung',
        required: false,
        type: 'textarea',
        gridClass: 'col-12',
      },
    ],
  },
];
