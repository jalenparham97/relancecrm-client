import { Service } from './service';
import { FormResponse, ServiceResponse } from '@/core/types';
import { axios } from '../libs/axios';

class ResponsesService extends Service<FormResponse> {
  async findResponses<T>(formId: string) {
    const { data } = await axios.get<ServiceResponse<T>>(`/${this.service}`, {
      params: { formId },
    });
    return data;
  }
}

export const responsesService = new ResponsesService('responses');
