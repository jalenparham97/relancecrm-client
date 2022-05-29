import { ObjectId } from 'mongoose';
import { Override, Proposal } from '@/core/types';

export type ProposalDocument = Override<Proposal, { userId: ObjectId }>;

export type ProposalTemplateData = {
  proposalUrl: string;
  contentSubject: string;
  total: string;
  message?: string;
};
