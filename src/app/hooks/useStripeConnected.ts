import { loadStripe } from '@stripe/stripe-js';
import { config } from '@/core/config';

export const useStripeConnected = () => {
  const getStripe = async (stripeAccountId: string) => {
    return await loadStripe(config.stripePublishableKey, {
      stripeAccount: stripeAccountId,
    });
  };
  return { getStripe };
};
