import mongoose, { Types } from 'mongoose';
import { TaskDocument } from '@/server/types';

const schema = new mongoose.Schema<TaskDocument>(
  {
    userId: { type: Types.ObjectId },
    content: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: String },
    clientId: { type: Types.ObjectId },
    project: { type: Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

export const taskModel = mongoose.models.Task || mongoose.model('Task', schema);
