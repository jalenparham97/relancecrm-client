import { config } from '@/core/config';
import {
  ServiceResponse,
  Proposal,
  CreateProposal,
  ProposalEmailData,
  User,
  ProposalStatus,
} from '@/core/types';
import { formatCurrency } from '@/core/utils';
import { proposalsModel } from '@/server/models';
import { EmailParams, mailer, Recipient } from '../libs/email/email-manager';
import {
  InvoiceTemplateData,
  Personalization,
  ProposalTemplateData,
} from '../types';

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

  async findProposalView(id: string): Promise<Proposal> {
    const query = { _id: id };

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

  async sendProposalEmail(emailOptions: ProposalEmailData, user: User) {
    try {
      const { proposal } = emailOptions;
      const email = this.createProposalEmail(emailOptions, user);
      await mailer.email.send(email);
      return await this.updateProposalStatus(proposal, user);
    } catch (error) {
      console.log(error);
    }
  }

  async sendTestProposalEmail(emailOptions: ProposalEmailData, user: User) {
    try {
      const isTest = true;
      const email = this.createProposalEmail(emailOptions, user, isTest);
      return await mailer.email.send(email);
    } catch (error) {
      console.log(error);
    }
  }

  private createProposalEmail(
    emailOptions: ProposalEmailData,
    user: User,
    isTest: boolean = false
  ) {
    const { proposal, sendUserCopy, message, subject, from } = emailOptions;

    // console.log({ isTest });

    console.log({ emailOptions });

    const isTestHeader = isTest ? 'Your test email:' : '';

    const dynamicTemplateData: Personalization<ProposalTemplateData> = {
      email: isTest ? user.email : proposal.client?.email,
      data: {
        proposalUrl: `${config.webAppURL}/proposals/${proposal._id}/view`,
        contentSubject: `${subject}`,
        total: formatCurrency(proposal.amount),
        message:
          message ||
          'Hi! Please find my proposal attached. Thanks for your business!',
      },
    };

    const email = new EmailParams();

    email.setFrom({ email: config.email.emailFrom });
    email.setSubject(`${isTestHeader} ${subject}`);
    email.setTemplateId(config.email.proposalTemplateId);
    email.setPersonalization([dynamicTemplateData]);

    if (isTest) {
      email.setTo([new Recipient(user.email)]);
    } else {
      email.setTo([new Recipient(proposal.toEmail)]);
      email.setBcc(sendUserCopy ? [new Recipient(user.email)] : []);
    }
    return email;
  }

  private async updateProposalStatus(proposal: Proposal, user: User) {
    return await proposalsModel
      .findOneAndUpdate(
        { _id: proposal._id, userId: user._id },
        { status: ProposalStatus.SENT },
        {
          new: true,
        }
      )
      .lean()
      .exec();
  }
}

export const proposalsService = new ProposalsService();
