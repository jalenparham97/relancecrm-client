import { isEmpty } from 'lodash';
import { config } from '@/core/config';
import { mailer, EmailParams, Recipient } from '@/server/libs/email/email-manager';
import {
  CreateInvoice,
  Invoice,
  InvoiceEmailData,
  InvoicePaymentDetails,
  InvoiceStatus,
  ServiceResponse,
  User,
} from '@/core/types';
import { InvoiceTemplateData, MailOptions, Personalization, TemplateData } from '@/server/types';
import { invoiceModel } from '@/server/models';
import { formatCurrency, formatDate, omitObjProperty } from '@/core/utils';
import { padInvoiceNumber } from '@/server/utils';
import dayjs from 'dayjs';

class InvoicesService {
  async create(createInvoiceData: CreateInvoice, userId: string): Promise<Invoice> {
    return await invoiceModel.create({ ...createInvoiceData, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Invoice>> {
    const query = { userId };

    const data = await invoiceModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .select('_id invoiceNumber toName issuedOn dueOn total status')
      .lean()
      .exec();

    const total = await invoiceModel.count(query);

    return { total, data };
  }

  async findAllProjectInvoices(
    projectId: string,
    userId: string
  ): Promise<ServiceResponse<Invoice>> {
    const query = { project: projectId, userId };

    const data = await invoiceModel
      .find({ project: projectId, userId })
      .sort({ createdAt: 'desc' })
      .select('_id invoiceNumber dueOn total status')
      .lean()
      .exec();

    const total = await invoiceModel.count(query);

    return { total, data };
  }

  async findAllClientInvoices(clientId: string, userId: string): Promise<ServiceResponse<Invoice>> {
    const query = { client: clientId, userId };

    const data = await invoiceModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .select('_id invoiceNumber dueOn total status')
      .lean()
      .exec();

    const total = await invoiceModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Invoice> {
    const query = { _id: id, userId };

    const data = await invoiceModel
      .findOne(query)
      .populate('client')
      .populate('project')
      .populate('recipients')
      .exec();

    return data;
  }

  async findInvoicePay(id: string): Promise<Invoice> {
    return await invoiceModel.findById(id).lean().exec();
  }

  async update(id: string, userId: string, updateData: CreateInvoice): Promise<Invoice> {
    let updateObject: CreateInvoice;

    if (updateData.invoiceNumber) {
      updateObject = {
        ...omitObjProperty(updateData, ['userId']),
        invoiceNumber: padInvoiceNumber(updateData.invoiceNumber, true),
      };
    } else {
      updateObject = {
        ...omitObjProperty(updateData, ['userId']),
      };
    }

    return await invoiceModel
      .findOneAndUpdate({ _id: id, userId }, updateObject, {
        new: true,
      })
      .exec();
  }

  async removeInvoiceProject(id: string, userId: string) {
    return await invoiceModel
      .findOneAndUpdate({ _id: id, userId }, { $unset: { project: '' } }, { new: true })
      .lean()
      .exec();
  }

  async removeMany(ids: string[]) {
    return await invoiceModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await invoiceModel.findOneAndRemove({ _id: id, userId });
  }

  async sendInvoiceEmail(invoiceEmailOptions: InvoiceEmailData, user: User) {
    try {
      const { invoice } = invoiceEmailOptions;
      const email = this.createInvoiceEmail(invoiceEmailOptions, user);
      await mailer.send(email);
      return await this.updateInvoiceStatus(invoice, user);
    } catch (error) {
      console.log(error);
    }
  }

  async sendTestInvoiceEmail(invoiceEmailOptions: InvoiceEmailData, user: User) {
    try {
      const isTest = true;
      const email = this.createInvoiceEmail(invoiceEmailOptions, user, isTest);
      return await mailer.send(email);
    } catch (error) {
      console.log(error);
    }
  }

  private createInvoiceEmail(emailOptions: InvoiceEmailData, user: User, isTest: boolean = false) {
    const { invoice, sendUserCopy, message, recipients, from } = emailOptions;

    const isTestHeader = isTest ? 'Your test email:' : '';

    const dynamicTemplateData: Personalization<TemplateData> = {
      email: isTest ? user.email : invoice.client?.email,
      data: {
        invoiceUrl: `${config.webAppURL}/invoices/${invoice._id}/pay`,
        contentSubject: `${invoice.client?.fullName} sent you an invoice`,
        invoiceNumber: `${invoice.invoiceNumber}`,
        total: formatCurrency(invoice.total),
        dueDate: formatDate(invoice.dueOn),
        message: message || 'Hi! Please find my invoice attached. Thanks for your business!',
      },
    };

    const email = new EmailParams();

    email.setFrom(config.email.emailFrom);
    email.setSubject(`${isTestHeader} ${invoice.fromName} sent you an invoice`);
    email.setTemplateId(config.email.invoiceTemplateId);
    email.setPersonalization([dynamicTemplateData]);

    if (isTest) {
      email.setRecipients([new Recipient(user.email)]);
    } else {
      const ccRecipients = recipients.map((recipient) => new Recipient(recipient));
      email.setRecipients([new Recipient(invoice.toEmail)]);
      email.setCc(!isEmpty(recipients) ? ccRecipients : []);
      email.setBcc(sendUserCopy ? [new Recipient(user.email)] : []);
    }
    return email;
  }

  private async updateInvoiceStatus(invoice: Invoice, user: User) {
    return await invoiceModel
      .findOneAndUpdate(
        { _id: invoice._id, userId: user._id },
        { status: InvoiceStatus.SENT },
        {
          new: true,
        }
      )
      .lean()
      .exec();
  }

  async updateInvoicePaid(id: string, paymentDetails: InvoicePaymentDetails) {
    try {
      return await invoiceModel
        .findByIdAndUpdate(
          id,
          {
            status: InvoiceStatus.PAID,
            paymentDate: dayjs().toISOString(),
            paymentDetails: { ...paymentDetails, paymentMethod: 'stripe' },
          },
          {
            new: true,
          }
        )
        .lean()
        .exec();
    } catch (error) {
      console.log(error);
      throw new Error('Invoice not found');
    }
  }
}

export const invoicesService = new InvoicesService();
