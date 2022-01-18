import mongoose from 'mongoose';
import { WebhookEvent } from '@/server/types';

const schema = new mongoose.Schema<WebhookEvent>(
  {
    _id: { type: String },
  },
  { timestamps: true }
);

export const webhookEventModel =
  mongoose.models.WebhookEvent || mongoose.model('WebhookEvent', schema);
