import { Service } from './service';
import { axios } from '@/app/libs/axios';
import { Form, FormResponse, ServiceResponse } from '@/core/types';

class FormsService extends Service<Form> {
  async findResponses(formId: string) {
    const { data } = await axios.get<ServiceResponse<FormResponse>>(
      `/${this.service}/${formId}/responses`
    );
    return data;
  }

  async getResponse<FormResponse>(formId: string) {
    const { data } = await axios.get<FormResponse>(
      `/${this.service}/${formId}/responses`
    );
    return data;
  }

  async createResponse(createData: FormResponse, formId: string) {
    const { data } = await axios.post<FormResponse>(
      `/${this.service}/${formId}/responses`,
      createData
    );
    return data;
  }

  async removeManyResponses(ids: string[], formId: string) {
    return await axios.delete(`/${this.service}/${formId}/responses`, {
      params: { ids },
    });
  }

  async removeResponse(formId: string, id: string) {
    return await axios.delete(`/${this.service}/${formId}/responses/${id}`);
  }
}

export const formsService = new FormsService('forms');
