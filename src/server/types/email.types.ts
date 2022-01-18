import { MailService, MailDataRequired } from '@sendgrid/mail';

export type Mailer = MailService;
export type MailOptions = MailDataRequired;
