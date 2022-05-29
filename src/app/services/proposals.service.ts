import { Service } from './service';
import {
  CreateProposal,
  Proposal,
  ProposalEmailData,
  ServiceResponse,
} from '@/core/types';
import { axios } from '@/app/libs/axios';

class ProposalsService extends Service<Proposal> {
  async createProposal(createData: CreateProposal) {
    const { data } = await axios.post<Proposal>(`/${this.service}`, createData);
    return data;
  }

  async removeProposalProject(id: string) {
    const { data } = await axios.patch<Proposal>(
      `/${this.service}/project`,
      {},
      { params: { id } }
    );
    return data;
  }

  async findAllClientProposals(clientId: string) {
    const { data } = await axios.get<ServiceResponse<Proposal>>(
      `/${this.service}/client`,
      {
        params: { clientId },
      }
    );
    return data;
  }

  async findAllProjectProposals(projectId: string) {
    const { data } = await axios.get<ServiceResponse<Proposal>>(
      `/${this.service}/project`,
      {
        params: { projectId },
      }
    );
    return data;
  }

  async findProposalView(id: string) {
    const { data } = await axios.get<Proposal>(`/${this.service}/${id}/view`);
    return data;
  }

  async sendProposalEmail(emailData: ProposalEmailData) {
    return await axios.post(`/${this.service}/send`, emailData);
  }

  async sendTestProposalEmail(emailData: ProposalEmailData) {
    return await axios.post(`/${this.service}/send/test`, emailData);
  }
}

export const proposalsService = new ProposalsService('proposals');
