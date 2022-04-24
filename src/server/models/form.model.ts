import mongoose, { Types } from 'mongoose';
import { FormDocument } from '@/server/types';
import { FormStatus, FormType } from '@/core/types';

const schema = new mongoose.Schema<FormDocument>(
  {
    userId: { type: Types.ObjectId },
    name: { type: String, trim: true, default: 'Untitled Form' },
    brandFillColor: { type: String, trim: true, default: '#4263eb' },
    brandTextColor: { type: String, trim: true, default: '#ffffff' },
    logoUrl: { type: String, trim: true },
    brandingEnabled: { type: Boolean, default: false },
    status: { type: String, default: FormStatus.OPEN },
    header: { type: String, trim: true, default: 'Untitled Form' },
    headerImage: { type: Object, default: { url: '', name: '' } },
    responsesCount: { type: Number, default: 0 },
    submitButtonText: { type: String, default: 'Send' },
    content: { type: [], default: [] },
    type: { type: String, default: FormType.USER },
    settings: {
      type: Object,
      default: {
        isClosed: false,
        closeMessageTitle: '',
        closeMessageDescription: '',
        sendEmailNotification: true,
        limitResponses: false,
      },
    },
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

export const formsModel =
  mongoose.models.Form || mongoose.model('Form', schema);
