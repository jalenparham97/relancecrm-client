import mongoose, { Types } from 'mongoose';
import { ClientDocument } from '@/server/types';
import { getInitials } from '@/app/utils';
import { shuffle } from 'lodash';
import randomColor from 'randomcolor';

const schema = new mongoose.Schema<ClientDocument>(
  {
    userId: { type: Types.ObjectId },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    backgroundColor: { type: String },
    phone: { type: String },
    address: { type: String },
    company: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

schema.pre<ClientDocument>('save', function (next) {
  this.backgroundColor = randomColor({ luminosity: 'dark' });
  next();
});

schema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

schema.virtual('initials').get(function () {
  return getInitials(`${this.firstName} ${this.lastName}`);
});

schema.set('toJSON', { virtuals: true });

export const clientModel = mongoose.models.Client || mongoose.model('Client', schema);
