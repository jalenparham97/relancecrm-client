import { NextApiRequest } from 'next';
import { User } from '@/core/types';

export interface ExtendedApiRequest extends NextApiRequest {
  user: User;
  params: Record<any, any>;
  rawBody: Buffer;
}
