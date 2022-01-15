import { config } from '@/core/config';
import { userModel } from '@/server/models';
import { InvoicePaymentInfo, SubscriptionPlan, User } from '@/core/types';
import { formatToCents } from '@/server/utils';
import Stripe from 'stripe';

class StripeApiAdapter {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2020-08-27',
    });
  }

  async createCheckoutSession(user: User) {
    try {
      const planId = config.stripe.plans[user.subscription.plan.toLowerCase()].id;

      return await this.stripe.checkout.sessions.create({
        customer: user.subscription.customerId,
        subscription_data: {
          items: [{ plan: planId, quantity: 1 }],
        },
        mode: 'subscription',
        payment_method_types: ['card'],
        success_url: `${config.webAppURL}/settings/billing?session_id={CHECKOUT_SESSION_ID}?status=success`,
        cancel_url: `${config.webAppURL}/subscribe`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createInvoiceCheckoutSession(invoicePaymentInfo: InvoicePaymentInfo) {
    const { invoiceId, lineItems, stripeAccountId } = invoicePaymentInfo;

    const line_items = lineItems.map((item) => ({
      name: item.description,
      amount: formatToCents(item.rate),
      quantity: item.units,
      currency: 'usd',
    }));

    try {
      return await this.stripe.checkout.sessions.create(
        {
          mode: 'payment',
          payment_method_types: ['card'],
          line_items,
          success_url: `${config.webAppURL}/invoices/${invoiceId}/pay`,
          cancel_url: `${config.webAppURL}/invoices/${invoiceId}/pay`,
          metadata: { invoiceId, stripeAccountId },
        },
        { stripeAccount: stripeAccountId }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createBillingPortalSession(user: User) {
    try {
      return await this.getBillingPortalSession(user);
    } catch (error) {
      console.log(error);
    }
  }

  // async createBillingPortalUpdateSession(user: User) {
  //   try {
  //     const subscriptionId = await this.getSubscriptionId(user);
  //     const session = await this.getBillingPortalSession(user);
  //     return { url: `${session.url}/subscriptions/${subscriptionId}/update` };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async createSubscription(customerId: string, plan: SubscriptionPlan) {
    const subscription = {
      Pro: {
        customer: customerId,
        items: [{ plan: config.stripe.plans[plan.toLowerCase()].id }],
        trial_period_days: config.stripe.plans[plan.toLowerCase()].trialDays,
      },
    };

    return await this.stripe.subscriptions.create(subscription[plan]);
  }

  private async createStripeAccount(user: User) {
    return await this.stripe.accounts.create({
      type: 'standard',
      email: user.email,
      metadata: {
        userId: user._id,
      },
    });
  }

  private async createStripeAccountLink(accountId: string) {
    try {
      return await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${config.webAppURL}/settings/payments`,
        return_url: `${config.webAppURL}/settings/payments`,
        type: 'account_onboarding',
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async updateStripeConnectedPayment(id: string, accountId: string) {
    const update = { connectPayments: { stripe: { accountId } } };
    return await userModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async createStripeConnectSession(user: User) {
    if (user.connectedPayments?.stripe?.accountId) {
      const accountId = user.connectedPayments?.stripe?.accountId;
      return await this.createStripeAccountLink(accountId);
    }
    const account = await this.createStripeAccount(user);

    const updatedUser = await this.updateStripeConnectedPayment(user._id, account.id);
    if (updatedUser) {
      return await this.createStripeAccountLink(account.id);
    }
  }

  async createStripeCustomer(customer: Stripe.CustomerCreateParams) {
    return this.stripe.customers.create(customer);
  }

  // async getStripeAccountPayment(paymentId: string, accountId: string) {
  //   return await this.stripe.paymentIntents.retrieve(
  //     paymentId,
  //     {
  //       expand: ['charges.data.balance_transaction'],
  //     },
  //     { stripeAccount: accountId }
  //   );
  // }

  // async constructStripeEventFromPayload(signature: string, payload: Buffer) {
  //   return this.stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
  // }

  // private async getSubscriptionId(user: User) {
  //   const subscriptions = await this.stripe.subscriptions.list({
  //     customer: user.subscription.customerId,
  //   });
  //   return subscriptions.data[0].id;
  // }

  private async getBillingPortalSession(user: User) {
    try {
      return await this.stripe.billingPortal.sessions.create({
        customer: user.subscription.customerId,
        return_url: `${config.webAppURL}/settings/billing`,
      });
    } catch (error) {
      console.log(error);
      // throw new BadRequestException(error);
    }
  }
}

export const stripeApi = new StripeApiAdapter();
