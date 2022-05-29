import { config } from '@/core/config';
import { MailerSend, EmailParams, Recipient } from 'mailer-send-ts';

const mailer = new MailerSend({ apiKey: config.email.apiKey });

export { mailer, EmailParams, Recipient };
