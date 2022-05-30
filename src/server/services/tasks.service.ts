import { ServiceResponse, Task } from '@/core/types';
import { taskModel } from '@/server/models';

class TasksService {
  async create(taskData: Task, userId: string): Promise<Task> {
    return await taskModel.create({ ...taskData, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Task>> {
    const query = { userId };

    const data = await taskModel
      .find(query)
      .sort({ _id: -1 })
      .populate('project')
      .exec();

    const total = await taskModel.count(query);

    return { total, data };
  }

  async findAllClientTasks(
    userId: string,
    clientId: string
  ): Promise<ServiceResponse<Task>> {
    const query = { userId, clientId };

    const data = await taskModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .populate('project')
      .exec();

    const total = await taskModel.count(query);

    return { total, data };
  }

  async findAllProjectTasks(
    userId: string,
    projectId: string
  ): Promise<ServiceResponse<Task>> {
    const query = { userId, project: projectId };

    const data = await taskModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .populate('project')
      .exec();

    const total = await taskModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const query = { _id: id, userId };

    const data = await taskModel.findOne(query).exec();

    return data;
  }

  async update(id: string, userId: string, updateData: Task): Promise<Task> {
    return await taskModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();
  }

  async removeMany(ids: string[]) {
    return await taskModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await taskModel.findOneAndRemove({ _id: id, userId });
  }
}

export const tasksService = new TasksService();
