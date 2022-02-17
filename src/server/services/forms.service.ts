import { Client, Form, FormResponse, Project, ServiceResponse, Task } from '@/core/types';
import { formsModel, responsesModel } from '@/server/models';

class FormsService {
  async create(createData: Form, userId: string): Promise<Form> {
    return await formsModel.create({ ...createData, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Form>> {
    const query = { userId };

    const data = await formsModel
      .find(query)
      .sort({ _id: -1 })
      .select('_id name responsesCount status createdAt updatedAt')
      .exec();

    const total = await formsModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Form> {
    const query = { _id: id, userId };

    const data = await formsModel.findOne(query).exec();

    return data;
  }

  async update(id: string, userId: string, updateData: Form): Promise<Client> {
    return await formsModel.findOneAndUpdate({ _id: id, userId }, updateData, { new: true }).exec();
  }

  async removeMany(ids: string[]) {
    return await formsModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await formsModel.findOneAndRemove({ _id: id, userId });
  }

  async createResponse(createData: FormResponse): Promise<FormResponse> {
    return await responsesModel.create(createData);
  }

  async findAllResponses(formId: string): Promise<ServiceResponse<FormResponse>> {
    const query = { formId };

    const data = await responsesModel.find(query).sort({ _id: -1 }).exec();

    const total = await responsesModel.count(query);

    return { total, data };
  }

  async removeManyResponses(ids: string[]) {
    return await responsesModel.deleteMany({ _id: { $in: ids } });
  }

  async removeResponse(id: string) {
    return await responsesModel.findOneAndRemove({ _id: id });
  }
}

export const formsService = new FormsService();
