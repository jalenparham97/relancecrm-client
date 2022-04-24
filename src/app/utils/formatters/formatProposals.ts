import { isEmpty } from 'lodash';
import { Proposal } from '@/core/types';
import { formatCurrency, formatDate } from '@/core/utils';
import { getFullName } from '@/app/utils';

export const formatProposals = (proposals: Proposal[]) => {
  if (!isEmpty(proposals)) {
    return proposals.map((proposal) => ({
      ...proposal,
      id: proposal._id,
      clientName: getFullName(proposal?.client) || '-',
      projectName: proposal.project?.projectName || '-',
      amount: formatCurrency(proposal.amount),
      createdAt: formatDate(proposal.createdAt),
    }));
  }
  return [];
};
