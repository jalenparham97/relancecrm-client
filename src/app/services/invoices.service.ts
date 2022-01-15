import { Service } from './service';
import { CreateInvoice, Invoice, InvoiceEmailData, ServiceResponse } from '@/core/types';
import { axios } from '@/app/libs/axios';

class InvoicesService extends Service<Invoice> {
  async createInvoice(createData: CreateInvoice) {
    const { data } = await axios.post<Invoice>(`/${this.service}`, createData);
    return data;
  }

  async removeInvoiceProject(id: string) {
    const { data } = await axios.patch<Invoice>(`/${this.service}/${id}/project`);
    return data;
  }

  async getInvoicePay(invoiceId: string) {
    const { data } = await axios.get<ServiceResponse<Invoice>>(`/${this.service}/${invoiceId}/pay`);
    return data;
  }

  async findAllClientInvoices(clientId: string) {
    const { data } = await axios.get<ServiceResponse<Invoice>>(`/${this.service}/client`, {
      params: { clientId },
    });
    return data;
  }

  async findAllProjectInvoices(projectId: string) {
    const { data } = await axios.get<ServiceResponse<Invoice>>(`/${this.service}/project`, {
      params: { projectId },
    });
    return data;
  }

  async sendInvoiceEmail(emailData: InvoiceEmailData) {
    return await axios.post(`/${this.service}/send`, emailData);
  }

  async sendTestInvoiceEmail(invoice: Invoice) {
    return await axios.post(`/${this.service}/send/test`, { invoice });
  }
}

export const invoicesService = new InvoicesService('invoices');
