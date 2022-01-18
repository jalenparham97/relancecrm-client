import { Override, Task } from '@/core/types';
import { ObjectId } from 'mongoose';

export type TaskDocument = Override<
  Task,
  { userId: ObjectId; clientId: ObjectId; project: ObjectId }
>;
