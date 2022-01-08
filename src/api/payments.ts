import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { paymentsService } from '@/services/payments.service';
import { StripeError } from '@stripe/stripe-js';
import { InvoicePaymentInfo } from '@/types';
import { useStripeConnected } from '@/hooks/useStripeConnected';

export const useCreateCheckoutSession = () => {
  const stripe = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState<StripeError>(null);
  const [error, setError] = useState<Error>(null);

  const initiateCheckoutSession = async () => {
    try {
      setIsLoading(true);
      const session = await paymentsService.createCheckoutSession();
      const { error: sessionError } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (sessionError) {
        console.log(sessionError);
        setStripeError(sessionError);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { initiateCheckoutSession, isLoading, error, stripeError };
};

export const useCreateInvoiceCheckoutSession = () => {
  const { getStripe } = useStripeConnected();
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState<StripeError>(null);
  const [error, setError] = useState<Error>(null);

  const initiateCheckoutSession = async (paymentInfo: InvoicePaymentInfo) => {
    try {
      setIsLoading(true);
      const stripe = await getStripe(paymentInfo.stripeAccountId);
      const session = await paymentsService.createInvoiceCheckoutSession(paymentInfo);
      const { error: sessionError } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (sessionError) {
        console.log(sessionError);
        setStripeError(sessionError);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { initiateCheckoutSession, isLoading, error, stripeError };
};

export const useBillingPortalSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const initiate = async () => {
    try {
      setIsLoading(true);
      const session = await paymentsService.createBillingPortalSession();
      if (session) {
        window.location.assign(session.url);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { initiate, isLoading, error };
};

export const useBillingPortalUpdateSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const initiate = async () => {
    try {
      setIsLoading(true);
      const session = await paymentsService.createBillingPortalUpdateSession();
      if (session) {
        window.location.assign(session.url);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { initiate, isLoading, error };
};

export const useStripeConnectSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const initiate = async () => {
    try {
      setIsLoading(true);
      const session = await paymentsService.createStripeConnectSession();
      console.log(session);
      if (session) {
        window.location.assign(session.url);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { initiate, isLoading, error };
};
