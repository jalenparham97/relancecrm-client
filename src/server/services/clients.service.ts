import { Client, Project, ServiceResponse, Task } from '@/core/types';
import { clientModel } from '@/server/models';

class ClientsService {
  async create(createData: Client, userId: string): Promise<Client> {
    return await clientModel.create({ ...createData, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Client>> {
    const query = { userId };

    const data = await clientModel.find(query).sort({ _id: -1 }).exec();

    const total = await clientModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Client> {
    const query = { _id: id, userId };

    const data = await clientModel.findOne(query).exec();

    return data;
  }

  async update(id: string, userId: string, updateData: Client): Promise<Client> {
    return await clientModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();
  }

  async removeMany(ids: string[]) {
    return await clientModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await clientModel.findOneAndRemove({ _id: id, userId });
  }
}

export const clientsService = new ClientsService();
