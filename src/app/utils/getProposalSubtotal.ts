import { ProposalEstimateItem } from '@/core/types';
import { getProposalItemSubtotal } from './getProposalItemSubtotal';

export const getProposalSubtotal = (items: ProposalEstimateItem[] = []) => {
  const subtotal = items.reduce(function (
    accumulator: number,
    item: ProposalEstimateItem
  ) {
    return accumulator + getProposalItemSubtotal(item);
  },
  0);

  return subtotal;
};
