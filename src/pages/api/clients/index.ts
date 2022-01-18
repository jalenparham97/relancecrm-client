import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { Client, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { clientsService } from '@/server/services/clients.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const response = await clientsService.findAll(req.user._id);
  return res.status(HttpStatus.OK).json(response);
});

handler.post(async (req, res) => {
  const createData: Client = req.body;
  try {
    const data = await clientsService.create(createData, req.user._id);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    throw new Error(error.message);
  }
});

handler.delete(async (req, res) => {
  const ids: string[] = [req.query['ids[]']].flat();
  await clientsService.removeMany(ids);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
