import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { projectsService } from '@/server/services/projects.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await projectsService.findAllClientProjects(
    req.user._id as string,
    req.query.clientId as string
  );
  return res.status(HttpStatus.OK).json(data);
});

export default handler;
