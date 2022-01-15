import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { ExtendedApiRequest, HttpStatus } from '@/core/types';
import { stripeApi } from '@/server/integrations/stripe';
import { requireAuth } from '@/server/middleware';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.post(async (req, res) => {
  try {
    const session = await stripeApi.createBillingPortalSession(req.user);
    return res.status(HttpStatus.OK).json({ url: session.url });
  } catch (error) {
    throw new Error(error.message);
  }
});

export default handler;
