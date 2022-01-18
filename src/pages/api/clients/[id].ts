import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { Client, ExtendedApiRequest, HttpStatus } from '@/core/types';
import { requireAuth } from '@/server/middleware';
import { clientsService } from '@/server/services/clients.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await clientsService.findOne(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json(data);
});

handler.patch(async (req, res) => {
  const body: Client = req.body;
  const data = await clientsService.update(req.query.id as string, req.user._id, body);
  return res.status(HttpStatus.OK).json(data);
});

handler.delete(async (req, res) => {
  try {
    await clientsService.remove(req.query.id as string, req.user._id);
    return res.status(HttpStatus.OK).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
