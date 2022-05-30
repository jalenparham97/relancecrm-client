import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { tasksService } from '@/server/services/tasks.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const tasks = await tasksService.findAllProjectTasks(
    req.user._id as string,
    req.query.projectId as string
  );
  return res.status(HttpStatus.OK).json(tasks);
});

export default handler;
