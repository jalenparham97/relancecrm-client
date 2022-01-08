import { Project } from './project.types';

export type Task = {
  _id?: string;
  userId?: string;
  content?: string;
  completed?: boolean;
  dueDate?: string;
  projectId?: string;
  clientId?: string;
  project?: string;
};

export type TaskResponse = {
  project?: Project;
} & Task;
