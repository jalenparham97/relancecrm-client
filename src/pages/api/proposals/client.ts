import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { proposalsService } from '@/server/services/proposals.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.get(async (req, res) => {
  const data = await proposalsService.findAllClientProposals(
    req.query.clientId as string,
    req.user._id
  );
  return res.status(HttpStatus.OK).json(data);
});

export default handler;
