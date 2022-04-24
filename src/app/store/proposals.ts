import { atom } from 'recoil';
import { Proposal } from '@/core/types';

export const proposalState = atom<Proposal>({
  key: 'proposalState',
  default: {},
});
