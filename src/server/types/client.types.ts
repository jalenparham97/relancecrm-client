import { ObjectId } from 'mongoose';
import { Override, Client } from '@/core/types';

export type ClientDocument = Override<Client, { userId: ObjectId }>;
