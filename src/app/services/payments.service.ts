import { Service } from './service';
import { StripeSession, CheckoutSession, InvoicePaymentInfo } from '@/core/types';
import { axios } from '@/app/libs/axios';

class PaymentsService extends Service<{}> {
  async createCheckoutSession() {
    const { data } = await axios.post<CheckoutSession>(`/${this.service}/checkout`);
    return data;
  }

  async createInvoiceCheckoutSession(paymentInfo: InvoicePaymentInfo) {
    const { data } = await axios.post<CheckoutSession>(
      `/${this.service}/checkout/invoice`,
      paymentInfo
    );
    return data;
  }

  async createStripeConnectSession() {
    const { data } = await axios.get<StripeSession>(`/${this.service}/connect/stripe`);
    return data;
  }

  async createBillingPortalSession() {
    const { data } = await axios.post<StripeSession>(`/${this.service}/billing`);
    return data;
  }

  async createBillingPortalUpdateSession() {
    const { data } = await axios.post<StripeSession>(`/${this.service}/billing/update`);
    return data;
  }
}

export const paymentsService = new PaymentsService('payments');
