import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { FormResponse, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { formsService } from '@/server/services/forms.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth).get(async (req, res) => {
  const response = await formsService.findAllResponses(
    req.query.formId as string
  );
  return res.status(HttpStatus.OK).json(response);
});

handler.post(async (req, res) => {
  const createData: FormResponse = req.body;
  try {
    const data = await formsService.createResponse(createData, req.user);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    throw new Error(error.message);
  }
});

handler.use(requireAuth).delete(async (req, res) => {
  const ids: string[] = [req.query['ids[]']].flat();
  await formsService.removeManyResponses(ids);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
