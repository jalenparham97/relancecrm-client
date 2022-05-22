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
  isArchived?: boolean;
  fromCompany?: string;
  fromAddress?: string;
  fromName?: string;
  toName?: string;
  toCompany?: string;
  toAddress?: string;
  toEmail?: string;
  content?: ProposalContent[];
  amount?: number;
  sentDate?: string;
  approvalDate?: string;
  approver?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProposalContent = {
  id?: string;
  type?: ProposalContentBlocksType;
  content?: string | JSONContent | JSONContent[];
  items?: ProposalEstimateItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
};

export type ProposalEstimateItem = {
  id: string;
  rate: number;
  description: string;
  units: number;
  unitsType: 'units' | 'hrs';
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
  ARCHIVED = 'archived',
}

export type Proposal = {
  client?: Client;
  project?: Project;
} & BaseProposal;

export type CreateProposal = {
  client?: string;
  project?: string;
} & BaseProposal;
