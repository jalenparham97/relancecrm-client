import { Service } from './service';
import { FormResponse } from '@/core/types';

class ResponsesService extends Service<FormResponse> {}

export const responsesService = new ResponsesService('responses');
