import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, Project } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { projectsService } from '@/server/services/projects.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await projectsService.findOne(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json(data);
});

handler.patch(async (req, res) => {
  const body: Project = req.body;
  const data = await projectsService.update(req.query.id as string, req.user._id, body);
  return res.status(HttpStatus.OK).json(data);
});

handler.delete(async (req, res) => {
  try {
    await projectsService.remove(req.query.id as string, req.user._id);
    return res.status(HttpStatus.OK).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
