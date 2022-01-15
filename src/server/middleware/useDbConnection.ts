import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { ExtendedApiRequest } from '@/core/types';
import { dbConnect } from '@/server/db';

export const useDbConnection = async (
  req: ExtendedApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    await dbConnect();
    next();
  } catch (error) {}
};
