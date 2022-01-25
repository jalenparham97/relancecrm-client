export type MailOptions<T = void> = {
  from: string | Recipient;
  to?: Recipient[];
  cc?: Recipient[];
  bcc?: Recipient[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  personalization?: Personalization<T>[];
};

export type Recipient = {
  email: string;
  name?: string;
};

export type Personalization<T> = {
  email: string;
  data: T;
};
