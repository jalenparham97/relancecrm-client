import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { Form, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { formsService } from '@/server/services/forms.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.delete(async (req, res) => {
  try {
    await formsService.removeResponse(req.query.id as string);
    return res.status(HttpStatus.OK).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
