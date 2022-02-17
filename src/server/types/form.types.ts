import { ObjectId } from 'mongoose';
import { Override, Form, FormResponse } from '@/core/types';

export type FormDocument = Override<Form, { userId: ObjectId }>;

export type FormResponseDocument = Override<FormResponse, { formId: ObjectId }>;
