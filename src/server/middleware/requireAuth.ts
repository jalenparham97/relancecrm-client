import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { ExtendedApiRequest } from '@/server/types';
import { adminAuth, extractJwtToken } from '@/server/libs/firebase-admin';
import { userModel } from '@/server/models';
import { dbConnect } from '@/server/db';

export const requireAuth = async (
  req: ExtendedApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    await dbConnect();
    const accessToken = extractJwtToken(req.headers.authorization);
    const { email } = await adminAuth.verifyIdToken(accessToken);
    const user = await userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('Unauthorized');
    }
    req.user = user ?? {};
    next();
  } catch (error) {}
};
