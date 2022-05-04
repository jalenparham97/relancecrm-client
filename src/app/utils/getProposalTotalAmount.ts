import { ProposalContent } from '@/core/types';
import { getProposalSubtotal } from './getProposalSubtotal';

export const getProposalTotalAmount = (block: ProposalContent) => {
  return getProposalSubtotal(block?.items) - block?.discount;
};
