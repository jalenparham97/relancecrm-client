import { ObjectId } from 'mongoose';
import { Override, Project } from '@/core/types';

export type ProjectDocument = Override<Project, { userId: ObjectId }>;
