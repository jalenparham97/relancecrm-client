import { config } from '@/core/config';
import mailer from '@sendgrid/mail';

mailer.setApiKey(config.email.emailApiKey);

export { mailer };
