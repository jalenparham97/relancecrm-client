import mongoose from 'mongoose';
import { User } from '@/core/types';
import { getInitials } from '@/app/utils';

const schema = new mongoose.Schema<User>(
  {
    uid: { type: String },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, unique: true, trim: true },
    photoUrl: { type: String },
    businessInfo: { type: Object },
    subscription: { type: Object },
    connectedPayments: { type: Object },
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

export const userModel = mongoose.models.User || mongoose.model('User', schema);
