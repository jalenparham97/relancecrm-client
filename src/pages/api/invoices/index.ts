import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { CreateInvoice, ExtendedApiRequest, HttpStatus } from '@/core/types';
import { requireAuth } from '@/server/middleware';
import { invoiceModel } from '@/server/models';

const handler = nc<ExtendedApiRequest, NextApiResponse>({ attachParams: true });

handler.use(requireAuth);

handler.get(async (req, res) => {
  const query = { userId: req.user._id };

  const data = await invoiceModel
    .find(query)
    .sort({ createdAt: 'desc' })
    .select('_id invoiceNumber toName issuedOn dueOn total status')
    .lean()
    .exec();

  const count = await invoiceModel.count(query);

  return res.status(HttpStatus.OK).json({ total: count, data });
});

handler.post(async (req, res) => {
  const invoiceData: CreateInvoice = req.body;
  try {
    const data = await invoiceModel.create({ userId: req.user._id, ...invoiceData });
    console.log({ data });
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    throw new Error(error.message);
  }
});

handler.delete(async (req, res) => {
  const body: { ids: string[] } = req.body;
  await invoiceModel.deleteMany({ _id: { $in: body.ids } });
  return res.status(HttpStatus.OK).json(body.ids);
});

export default handler;
