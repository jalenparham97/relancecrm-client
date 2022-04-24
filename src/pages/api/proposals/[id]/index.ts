import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { CreateProposal, HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { proposalsService } from '@/server/services/proposals.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const proposal = await proposalsService.findOne(
    req.query.id as string,
    req.user._id
  );
  return res.status(HttpStatus.OK).json(proposal);
});

handler.patch(async (req, res) => {
  const body: CreateProposal = req.body;
  const proposal = await proposalsService.update(
    req.query.id as string,
    req.user._id,
    body
  );
  return res.status(HttpStatus.OK).json(proposal);
});

handler.delete(async (req, res) => {
  await proposalsService.remove(req.query.id as string, req.user._id);
  return res.status(HttpStatus.OK).json({ message: 'success' });
});

export default handler;
