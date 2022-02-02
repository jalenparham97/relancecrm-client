import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { Form, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { formsService } from '@/server/services/forms.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await formsService.findOne(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json(data);
});

handler.patch(async (req, res) => {
  const body: Form = req.body;
  const data = await formsService.update(req.query.id as string, req.user._id, body);
  return res.status(HttpStatus.OK).json(data);
});

handler.delete(async (req, res) => {
  try {
    await formsService.remove(req.query.id as string, req.user._id);
    return res.status(HttpStatus.OK).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
