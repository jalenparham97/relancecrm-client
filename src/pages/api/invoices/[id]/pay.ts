import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { useDbConnection } from '@/server/middleware';
import { invoicesService } from '@/server/services/invoices.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(useDbConnection);

handler.get(async (req, res) => {
  const invoice = await invoicesService.findInvoicePay(req.query.id as string);
  return res.status(HttpStatus.OK).json(invoice);
});

export default handler;
