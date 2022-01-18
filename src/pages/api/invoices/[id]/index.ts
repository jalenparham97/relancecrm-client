import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { CreateInvoice, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { invoicesService } from '@/server/services/invoices.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const invoice = await invoicesService.findOne(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json(invoice);
});

handler.patch(async (req, res) => {
  const body: CreateInvoice = req.body;
  const invoice = await invoicesService.update(req.query.id as string, req.user._id, body);
  return res.status(HttpStatus.OK).json(invoice);
});

handler.delete(async (req, res) => {
  await invoicesService.remove(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
