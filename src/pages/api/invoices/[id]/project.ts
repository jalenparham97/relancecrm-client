import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { ExtendedApiRequest, HttpStatus } from '@/core/types';
import { requireAuth } from '@/server/middleware';
import { invoiceModel } from '@/server/models';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.patch(async (req, res) => {
  const invoice = await invoiceModel
    .findOneAndUpdate(
      { _id: req.query.id, userId: req.user._id },
      { $unset: { project: '' } },
      { new: true }
    )
    .lean()
    .exec();

  return res.status(HttpStatus.OK).json(invoice);
});

export default handler;
