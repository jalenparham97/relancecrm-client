import { ProposalEstimateItem } from '@/core/types';

export const getProposalItemSubtotal = (item: ProposalEstimateItem) => {
  return Number(item.units) * Number(item.rate);
};
