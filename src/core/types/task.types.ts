import { ObjectId } from 'mongoose';
import { Project } from './project.types';

export type Task = {
  _id?: string;
  userId?: string | ObjectId;
  content?: string;
  completed?: boolean;
  dueDate?: string;
  projectId?: string;
  clientId?: string | ObjectId;
  project?: string | ObjectId;
};

export type TaskResponse = {
  project?: Project;
} & Task;
