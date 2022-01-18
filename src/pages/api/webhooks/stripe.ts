import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { stripeApi } from '@/server/integrations/stripe';
import { useDbConnection, useRawBody } from '@/server/middleware';
import { paymentsService } from '@/server/services/payments.service';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(useDbConnection);
handler.use(useRawBody);

handler.post(async (req, res) => {
  const signature = req.headers['stripe-signature']! as string;

  if (!signature) {
    throw new Error('Missing stripe-signature header');
  }

  try {
    const event = stripeApi.constructEventFromPayload(signature, req.rawBody);

    console.log({ event });

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

export default handler;
