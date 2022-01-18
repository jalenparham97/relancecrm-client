import { ObjectId } from 'mongoose';
import { Client } from './client.types';

export type BaseProject = {
  _id?: string;
  userId?: string;
  projectName?: string;
  description?: string;
  backgroundColor?: string;
  initials?: string;
  status?: ProjectStatus;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProject = {
  client?: string;
} & BaseProject;

export type Project = {
  client?: Client;
} & BaseProject;

export enum ProjectStatus {
  ACTIVE = 'Active',
  DONE = 'Done',
}
