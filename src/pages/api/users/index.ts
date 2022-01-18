import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, User } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { usersService } from '@/server/services/users.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const response = await usersService.findAll();
  return res.status(HttpStatus.OK).json(response);
});

handler.post(async (req, res) => {
  const createData: User = req.body;
  try {
    const data = await usersService.create(createData);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    throw new Error(error.message);
  }
});

export default handler;
