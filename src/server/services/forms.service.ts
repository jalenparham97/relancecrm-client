import { Client, Form, Project, ServiceResponse, Task } from '@/core/types';
import { formsModel } from '@/server/models';

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
}

export const formsService = new FormsService();
