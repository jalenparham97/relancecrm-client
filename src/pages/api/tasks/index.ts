import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, Task } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { tasksService } from '@/server/services/tasks.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const response = await tasksService.findAll(req.user._id);
  return res.status(HttpStatus.OK).json(response);
});

handler.post(async (req, res) => {
  const createData: Task = req.body;
  try {
    const data = await tasksService.create(createData, req.user._id);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    throw new Error(error.message);
  }
});

handler.delete(async (req, res) => {
  const ids: string[] = [req.query['ids[]']].flat();
  await tasksService.removeMany(ids);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
