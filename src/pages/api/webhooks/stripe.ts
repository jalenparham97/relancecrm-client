import nc from 'next-connect';
import Cors from 'micro-cors';
import { buffer } from 'micro';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { stripeApi } from '@/server/integrations/stripe';
import { useDbConnection } from '@/server/middleware';
import { paymentsService } from '@/server/services/payments.service';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(useDbConnection);

handler.post(async (req, res) => {
  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature']! as string;

  if (!signature) {
    throw new Error('Missing stripe-signature header');
  }

  try {
    const event = stripeApi.constructEventFromPayload(signature, rawBody);

    switch (event.type) {
      case 'customer.subscription.updated':
        await paymentsService.processSubscriptionUpdate(event);
        break;
      case 'account.updated' || 'account.application.authorized':
        await paymentsService.processStripeAccountUpdate(event);
        break;
      case 'checkout.session.completed':
        await paymentsService.processInvoicePaid(event);
        break;
      default:
        break;
    }
    return res.status(HttpStatus.OK).json({ received: true });
  } catch (error) {
    throw new Error(error.message);
  }
});

export default cors(handler as any);
