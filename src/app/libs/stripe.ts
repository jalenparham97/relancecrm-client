import { loadStripe } from '@stripe/stripe-js';
import { config } from '@/core/config';

export const stripePromise = loadStripe(config.stripePublishableKey);
