import { CreateProject, Project, ServiceResponse } from '@/core/types';
import { projectModel } from '@/server/models';

class ProjectsService {
  async create(createData: CreateProject, userId: string): Promise<Project> {
    return await projectModel.create({ ...createData, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Project>> {
    const query = { userId };

    const data = await projectModel.find(query).sort({ _id: -1 }).exec();

    const total = await projectModel.count(query);

    return { total, data };
  }

  async findAllClientProjects(userId: string, clientId: string): Promise<ServiceResponse<Project>> {
    const query = { userId, client: clientId };

    const data = await projectModel.find(query).sort({ createdAt: 'desc' }).exec();

    const total = await projectModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const query = { _id: id, userId };

    const data = await projectModel.findOne(query).populate('client').exec();

    return data;
  }

  async update(id: string, userId: string, updateData: Project): Promise<Project> {
    return await projectModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();
  }

  async removeMany(ids: string[]) {
    return await projectModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await projectModel.findOneAndRemove({ _id: id, userId });
  }
}

export const projectsService = new ProjectsService();
