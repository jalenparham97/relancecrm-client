import { buffer } from 'micro';
import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { ExtendedApiRequest } from '@/server/types';

export const useRawBody = async (
  req: ExtendedApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const reqBuffer = await buffer(req);
    if (req.url === '/api/webhooks/stripe' && Buffer.isBuffer(reqBuffer)) {
      req.rawBody = Buffer.from(reqBuffer);
    }
    next();
  } catch (error) {}
};
