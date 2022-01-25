import { config } from '@/core/config';
import MailerSend, { EmailParams, Recipient } from 'mailersend';

const mailer = new MailerSend({ api_key: config.email.apiKey });

export { mailer, EmailParams, Recipient };
