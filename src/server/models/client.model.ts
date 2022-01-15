import mongoose from 'mongoose';
import { Client } from '@/core/types';
import { getInitials } from '@/app/utils';

const schema = new mongoose.Schema<Client>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, unique: true, trim: true },
    backgroundColor: { type: String },
    phone: { type: String },
    address: { type: String },
    company: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

schema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

schema.virtual('initials').get(function () {
  return getInitials(`${this.firstName} ${this.lastName}`);
});

schema.set('toJSON', { virtuals: true });

export const clientModel = mongoose.models.Client || mongoose.model('Client', schema);
