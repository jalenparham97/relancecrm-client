import { Service } from './service';
import { Form } from '@/core/types';

class FormsService extends Service<Form> {}

export const formsService = new FormsService('forms');
