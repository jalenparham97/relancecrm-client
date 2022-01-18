import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { invoicesService } from '@/server/services/invoices.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await invoicesService.findAllProjectInvoices(
    req.query.projectId as string,
    req.user._id
  );
  return res.status(HttpStatus.OK).json(data);
});

handler.patch(async (req, res) => {
  const invoice = await invoicesService.removeInvoiceProject(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json(invoice);
});

export default handler;
