import mongoose, { Types } from 'mongoose';
import { FormDocument } from '@/server/types';
import { FormStatus, FormType } from '@/core/types';
import randomColor from 'randomcolor';

const schema = new mongoose.Schema<FormDocument>(
  {
    userId: { type: Types.ObjectId },
    name: { type: String, default: 'Untitled Form' },
    brandFillColor: { type: String },
    brandTextColor: { type: String, default: '#ffffff' },
    logoUrl: { type: String },
    brandingEnabled: { type: Boolean, default: false },
    status: { type: String, default: FormStatus.DRAFT },
    header: { type: String, default: 'Untitled Form' },
    headerImageUrl: { type: String },
    responsesCount: { type: Number, default: 0 },
    submitButtonText: { type: String, default: 'Send' },
    content: { type: Array, default: [] },
    type: { type: String, default: FormType.USER },
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

export const formsModel = mongoose.models.Form || mongoose.model('Form', schema);
