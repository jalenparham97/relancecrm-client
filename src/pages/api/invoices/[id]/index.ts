import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { CreateInvoice, ExtendedApiRequest, HttpStatus } from '@/core/types';
import { requireAuth } from '@/server/middleware';
import { invoiceModel } from '@/server/models';
import { omitObjProperty, padInvoiceNumber } from '@/server/utils';

const handler = nc<ExtendedApiRequest, NextApiResponse>({ attachParams: true });

handler.use(requireAuth);

handler.get(async (req, res) => {
  const query = { _id: req.query.id, userId: req.user._id };

  const data = await invoiceModel
    .findOne(query)
    .populate('client')
    .populate('project')
    .populate('recipients')
    .exec();

  return res.status(HttpStatus.OK).json(data);
});

handler.patch(async (req, res) => {
  const body: CreateInvoice = req.body;

  let updateObject: CreateInvoice;

  if (body.invoiceNumber) {
    updateObject = {
      ...omitObjProperty(body, ['userId']),
      invoiceNumber: padInvoiceNumber(body.invoiceNumber, true),
    };
  } else {
    updateObject = {
      ...omitObjProperty(body, ['userId']),
    };
  }

  const update = await invoiceModel
    .findOneAndUpdate({ _id: req.query.id, userId: req.user._id }, updateObject, {
      new: true,
    })
    .exec();

  return res.status(HttpStatus.OK).json(update);
});

handler.delete(async (req, res) => {
  const body: { ids: string[] } = req.body;
  await invoiceModel.findOneAndRemove({ _id: req.query.id, userId: req.user._id });
  return res.status(HttpStatus.OK).json(body.ids);
});

export default handler;
