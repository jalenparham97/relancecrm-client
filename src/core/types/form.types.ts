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
  headerImage?: HeaderImage;
  responsesCount?: number;
  submitButtonText?: string;
  content?: FormElement[];
  type?: FormType;

  createdAt?: string;
  updatedAt?: string;
};

type HeaderImage = {
  url?: string;
  name?: string;
};

export type FormElement = {
  id?: string;
  label?: string;
  subtype?: FormElementSubTypeType;
  type?: 'text' | 'select' | 'email';
  options?: FormOption[];
  required?: boolean;
  description?: string;
  showDescription?: boolean;
};

export type FormOption = {
  id: string;
  option: string;
};

export type FormElementSubTypeType =
  | 'email'
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
