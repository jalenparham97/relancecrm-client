export type Form = {
  _id?: string;
  userId?: string;
  name?: string;
  brandFillColor?: string;
  brandTextColor?: string;
  logoUrl?: string;
  brandingEnabled?: boolean;
  status?: FormStatus;
  header?: string;
  headerImageUrl?: string;
  responsesCount?: number;
  submitButtonText?: string;
  content?: FormElement[];
  type?: FormType;

  createdAt?: string;
  updatedAt?: string;
};

export type FormElement = {
  id?: string;
  label?: string;
  subtype?: FormElementSubTypeType;
  type?: 'text' | 'select' | 'email';
  options?: string[];
  required?: boolean;
  description?: string;
  showDescription?: boolean;
};

export type FormElementSubTypeType =
  | 'single_line'
  | 'paragraph'
  | 'heading'
  | 'single_choice'
  | 'multiple_choice'
  | 'number';

export enum FormStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

export enum FormType {
  BUILT_IN = 'built_in',
  USER = 'user',
  COMMUNITY = 'community',
}
