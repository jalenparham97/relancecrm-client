import mongoose, { Types } from 'mongoose';
import { FormResponseDocument } from '@/server/types';

const schema = new mongoose.Schema<FormResponseDocument>(
  {
    formId: { type: Types.ObjectId },
    content: { type: [], default: [] },
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

export const responsesModel =
  mongoose.models.Response || mongoose.model('Response', schema);
