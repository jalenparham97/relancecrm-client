import mongoose, { Types } from 'mongoose';
import { Task } from '@/core/types';

const schema = new mongoose.Schema<Task>(
  {
    userId: { type: Types.ObjectId },
    content: { type: String, trim: true },
    completed: { type: Boolean },
    dueDate: { type: String },
    clientId: { type: Types.ObjectId },
    project: { type: Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

export const taskModel = mongoose.models.Task || mongoose.model('Task', schema);
