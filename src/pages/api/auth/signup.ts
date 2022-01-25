import nc from 'next-connect';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpStatus, SubscriptionPlans, UserSignupData } from '@/core/types';
import { stripeApi } from '@/server/integrations/stripe';
import { config } from '@/core/config';
import { usersService } from '@/server/services/users.service';
import { useDbConnection } from '@/server/middleware';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(useDbConnection);

handler.post(async (req, res) => {
  const body: UserSignupData = req.body;
  try {
    const customer = await stripeApi.createStripeCustomer({
      email: body.email,
    });
    const subscription = await stripeApi.createSubscription(customer.id, SubscriptionPlans.PRO);
    const user = await usersService.create({
      ...body,
      subscription: {
        customerId: customer.id,
        plan: SubscriptionPlans.PRO,
        status: subscription.status,
        isInTrial: true,
        trialEndDate: dayjs()
          .add(config.stripe.plans[SubscriptionPlans.PRO.toLowerCase()].trialDays, 'day')
          .toISOString(),
      },
    });
    return res.status(HttpStatus.OK).json(user);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('User already exists');
    }
    throw new Error(error.message);
  }
});

export default handler;
