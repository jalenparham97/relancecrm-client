import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, InvoiceEmailData } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { invoicesService } from '@/server/services/invoices.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.post(async (req, res) => {
  const invoiceEmailOptions: InvoiceEmailData = req.body;
  await invoicesService.sendTestInvoiceEmail(invoiceEmailOptions, req.user);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
