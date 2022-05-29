import mongoose, { Types } from 'mongoose';
import { ProposalDocument } from '@/server/types';
import { ProposalStatus } from '@/core/types';

const schema = new mongoose.Schema<ProposalDocument>(
  {
    userId: { type: Types.ObjectId },
    title: { type: String, trim: true, default: 'Proposal' },
    brandFillColor: { type: String, trim: true, default: '#4263eb' },
    brandTextColor: { type: String, trim: true, default: '#ffffff' },
    logoUrl: { type: String, trim: true, default: '' },
    status: { type: String, default: ProposalStatus.DRAFT },
    headerImgUrl: { type: String, trim: true, default: '' },
    content: { type: [], default: [] },
    project: { type: Types.ObjectId, ref: 'Project' },
    client: { type: Types.ObjectId, ref: 'Client' },
    fromCompany: { type: String, default: '' },
    fromAddress: { type: String, default: '' },
    fromName: { type: String, default: '' },
    toName: { type: String, default: '' },
    toEmail: { type: String, default: '' },
    toCompany: { type: String, default: '' },
    toAddress: { type: String, default: '' },
    sentDate: { type: String, default: '' },
    expirationDate: { type: String, default: '' },
    approver: { type: String, default: '' },
    approvalDate: { type: String, default: '' },
    decliner: { type: String, default: '' },
    declineDate: { type: String, default: '' },
    isArchived: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    isInvoiceAutoCreationEnabled: { type: Boolean, default: false },
    isInvoiceCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

export const proposalsModel =
  mongoose.models.Proposal || mongoose.model('Proposal', schema);
