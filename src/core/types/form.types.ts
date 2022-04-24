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
  settings?: FormSettings;
};

export type FormSettings = {
  isClosed?: boolean;
  closeMessageDescription?: string;
  closeMessageTitle?: string;
  hasClosedMessage?: boolean;
  sendEmailNotification?: boolean;
  maxResponses?: number;
  limitResponses?: boolean;
};

export type FormResponse = {
  _id?: string;
  id?: string;
  formId: string;
  content: FormResponseContent;
  createdAt?: string;
  updatedAt?: string;
};

export type FormResponseContent = {
  element: FormElement;
  value?: string | string[];
}[];

export type HeaderImage = {
  url?: string;
  name?: string;
};

export type FormElement = {
  id?: string;
  label?: string;
  subtype?: FormElementSubTypeType;
  type?: 'text' | 'select' | 'email' | 'tel';
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
  | 'phone'
  | 'single_line'
  | 'paragraph'
  | 'heading'
  | 'single_choice'
  | 'multiple_choice'
  | 'number';

export enum FormStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum FormType {
  BUILT_IN = 'built_in',
  USER = 'user',
  COMMUNITY = 'community',
}
