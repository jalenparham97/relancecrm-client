import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, Task } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { tasksService } from '@/server/services/tasks.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const task = await tasksService.findOne(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json(task);
});

handler.patch(async (req, res) => {
  const body: Task = req.body;
  const task = await tasksService.update(req.query.id as string, req.user._id, body);
  return res.status(HttpStatus.OK).json(task);
});

handler.delete(async (req, res) => {
  try {
    await tasksService.remove(req.query.id as string, req.user._id);
    return res.status(HttpStatus.OK).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
