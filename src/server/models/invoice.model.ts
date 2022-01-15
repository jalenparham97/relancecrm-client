import mongoose, { Document, Types } from 'mongoose';
import { Invoice, InvoiceStatus, InvoiceTypes } from '@/core/types';
import { padInvoiceNumber } from '@/server/utils';
import dayjs from 'dayjs';

type InvoiceDocument = Invoice & Document;

const schema = new mongoose.Schema<Invoice>(
  {
    userId: { type: Types.ObjectId },
    amountDue: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxLabel: { type: String, default: 'Tax' },
    sentDate: { type: String, default: '' },
    paymentDate: { type: String, default: '' },
    issuedOn: { type: String },
    dueOn: { type: String },
    invoiceNumber: { type: String },
    status: { type: String, default: InvoiceStatus.DRAFT },
    type: { type: String, default: InvoiceTypes.ONE_TIME },
    fromCompany: { type: String, default: '' },
    fromAddress: { type: String, default: '' },
    fromName: { type: String, default: '' },
    toAddress: { type: String, default: '' },
    toName: { type: String, default: '' },
    toEmail: { type: String, default: '' },
    toCompany: { type: String, default: '' },
    items: { type: [], default: [] },
    notes: { type: String, default: '' },
    project: { type: Types.ObjectId, ref: 'Project' },
    client: { type: Types.ObjectId, ref: 'Client' },
    recipients: { type: [{ type: Types.ObjectId, ref: 'Client' }], default: [] },
    paymentMethods: { type: Object },
    paymentDetails: { type: Object, default: {} },
  },
  { timestamps: true }
);

schema.pre<InvoiceDocument>('save', async function (next) {
  const invoices = await this.collection
    .find({ userId: this.userId })
    .sort({ createdAt: 1 })
    .toArray();
  const lastInvoiceNumber = invoices.length ? invoices[invoices.length - 1]?.invoiceNumber : '0';
  this.invoiceNumber = padInvoiceNumber(lastInvoiceNumber);
  this.issuedOn = dayjs().toISOString();
  this.dueOn = dayjs(this.issuedOn).add(1, 'month').toISOString();
  next();
});

schema.set('toJSON', { virtuals: true });

export const invoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', schema);
