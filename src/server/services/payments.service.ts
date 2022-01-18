import { config } from '@/core/config';
import { SubscriptionData, User } from '@/core/types';
import { webhookEventModel } from '@/server/models';
import { usersService } from '@/server/services/users.service';
import { invoicesService } from '@/server/services/invoices.service';
import { stripeApi } from '@/server/integrations/stripe';
import { formatToDollars } from '@/core/utils';
import Stripe from 'stripe';

class PaymentsService {
  private async createEvent(id: string) {
    return await webhookEventModel.create({ _id: id });
  }

  async processSubscriptionUpdate(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error) {
        throw new Error('This event was already processed');
      }
    }

    const data = event.data.object as Stripe.Subscription;
    const customerId = data.customer as string;
    const status = data.status;
    const planId = data.items.data[0].price.id;
    const plans = Object.values(config.stripe.plans);

    const subscription: SubscriptionData = {
      customerId,
      status,
      isInTrial: data.status === 'trialing',
      plan: plans.find((plan) => plan.id === planId).name,
    };

    await usersService.updateSubscription(subscription);
  }

  async processStripeAccountUpdate(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error) {
        throw new Error('This event was already processed');
      }
    }

    const account = event.data.object as Stripe.Account;
    console.log({ accountUpdate: account.details_submitted });
    console.log({ account });

    // return await usersService.updateStripeConnectedPayment(account.id);
  }

  async processInvoicePaid(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error) {
        throw new Error('This event was already processed');
      }
    }
    const data = event.data.object as Stripe.Checkout.Session;
    const invoiceId = data.metadata.invoiceId;
    const stripeAccountId = data.metadata.stripeAccountId;
    const paymentId = data.payment_intent as string;

    const payment = await stripeApi.getStripeAccountPayment(paymentId, stripeAccountId);

    const balance = payment.charges.data[0].balance_transaction as Stripe.BalanceTransaction;

    const fee = formatToDollars(balance.fee);
    const net = formatToDollars(balance.net);
    const transactionId = balance.source as string;

    return await invoicesService.updateInvoicePaid(invoiceId, {
      fee,
      net,
      transactionId,
    });
  }
}

export const paymentsService = new PaymentsService();
