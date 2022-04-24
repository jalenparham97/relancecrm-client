import { ObjectId } from 'mongoose';
import { Override, Proposal } from '@/core/types';

export type ProposalDocument = Override<Proposal, { userId: ObjectId }>;
