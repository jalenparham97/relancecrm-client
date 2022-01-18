import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { CreateInvoice, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { invoicesService } from '@/server/services/invoices.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const response = await invoicesService.findAll(req.user._id);
  return res.status(HttpStatus.OK).json(response);
});

handler.post(async (req, res) => {
  const invoiceData: CreateInvoice = req.body;
  try {
    const data = await invoicesService.create(invoiceData, req.user._id);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    throw new Error(error.message);
  }
});

handler.delete(async (req, res) => {
  const ids: string[] = [req.query['ids[]']].flat();
  await invoicesService.removeMany(ids);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
