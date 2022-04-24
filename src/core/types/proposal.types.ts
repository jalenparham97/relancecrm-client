import { JSONContent } from '@tiptap/react';
import { Client } from './client.types';
import { Project } from './project.types';

export type BaseProposal = {
  _id?: string;
  userId?: string;
  title?: string;
  brandFillColor?: string;
  brandTextColor?: string;
  logoUrl?: string;
  headerImgUrl?: string;
  isInvoiceAutoCreationEnabled?: boolean;
  isInvoiceCreated?: boolean;
  expirationDate?: string;
  status?: ProposalStatus;
  fromCompany?: string;
  fromAddress?: string;
  fromName?: string;
  content?: ProposalContent[];
  sentDate?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProposalContent = {
  id?: string;
  type?: ProposalContentBlocksType;
  content?: string | JSONContent | JSONContent[];
};

export type ProposalContentBlocksType =
  | 'text'
  | 'image'
  | 'estimate'
  | 'timeline';

export enum ProposalStatus {
  APPROVED = 'approved',
  SENT = 'sent',
  DECLINED = 'declined',
  READ = 'read',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

export type Proposal = {
  client?: Client;
  project?: Project;
} & BaseProposal;

export type CreateProposal = {
  client?: string;
  project?: string;
} & BaseProposal;
