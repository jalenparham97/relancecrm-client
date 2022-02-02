import { ObjectId } from 'mongoose';
import { Override, Form } from '@/core/types';

export type FormDocument = Override<Form, { userId: ObjectId }>;
