import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { stripeApi } from '@/server/integrations/stripe';
import { requireAuth } from '@/server/middleware';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.post(async (req, res) => {
  try {
    const session = await stripeApi.createCheckoutSession(req.user);
    return res.status(HttpStatus.OK).json({ ...session });
  } catch (error) {
    throw new Error(error.message);
  }
});

export default handler;
