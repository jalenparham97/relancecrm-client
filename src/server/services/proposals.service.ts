import { ServiceResponse, Proposal, CreateProposal } from '@/core/types';
import { proposalsModel } from '@/server/models';

class ProposalsService {
  async create(data: CreateProposal, userId: string): Promise<Proposal> {
    return await proposalsModel.create({ ...data, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Proposal>> {
    const query = { userId };

    const data = await proposalsModel
      .find(query)
      .sort({ _id: -1 })
      .populate('client')
      .populate('project', '_id projectName')
      .select(
        '_id title project client createdAt sentDate amount status content isArchived client fromName fromCompany fromAddress'
      )
      .lean()
      .exec();

    const total = await proposalsModel.count(query);

    return { total, data };
  }

  async findAllClientProposals(
    userId: string,
    clientId: string
  ): Promise<ServiceResponse<Proposal>> {
    const query = { userId, clientId };

    const data = await proposalsModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .populate('client', 'firstName lastName')
      .populate('project', '_id projectName')
      .exec();

    const total = await proposalsModel.count(query);

    return { total, data };
  }

  async findAllProjectProposals(
    userId: string,
    projectId: string
  ): Promise<ServiceResponse<Proposal>> {
    const query = { userId, projectId };

    const data = await proposalsModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .populate('client', 'firstName lastName')
      .populate('project', '_id projectName')
      .exec();

    const total = await proposalsModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Proposal> {
    const query = { _id: id, userId };

    const data = await proposalsModel
      .findOne(query)
      .populate('client')
      .populate('project')
      .exec();

    return data;
  }

  async update(
    id: string,
    userId: string,
    updateData: CreateProposal
  ): Promise<Proposal> {
    return await proposalsModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();
  }

  async removeProposalProject(id: string, userId: string) {
    return await proposalsModel
      .findOneAndUpdate(
        { _id: id, userId },
        { $unset: { project: '' } },
        { new: true }
      )
      .lean()
      .exec();
  }

  async removeMany(ids: string[]) {
    return await proposalsModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await proposalsModel.findOneAndRemove({ _id: id, userId });
  }
}

export const proposalsService = new ProposalsService();
