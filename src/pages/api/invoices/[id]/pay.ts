import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { ExtendedApiRequest, HttpStatus } from '@/core/types';
import { useDbConnection } from '@/server/middleware';
import { invoiceModel } from '@/server/models';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(useDbConnection);

handler.get(async (req, res) => {
  const invoice = await invoiceModel.findById(req.query.id).lean().exec();
  return res.status(HttpStatus.OK).json(invoice);
});

export default handler;
