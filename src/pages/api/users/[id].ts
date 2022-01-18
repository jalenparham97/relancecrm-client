import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, User } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { usersService } from '@/server/services/users.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await usersService.findOne(req.query.id as string);
  return res.status(HttpStatus.OK).json(data);
});

handler.patch(async (req, res) => {
  const body: User = req.body;
  const data = await usersService.update(req.query.id as string, body);
  return res.status(HttpStatus.OK).json(data);
});

handler.delete(async (req, res) => {
  try {
    await usersService.remove(req.query.id as string);
    return res.status(HttpStatus.OK).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
