import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { useDbConnection } from '@/server/middleware';
import { proposalsService } from '@/server/services/proposals.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(useDbConnection);

handler.get(async (req, res) => {
  const proposal = await proposalsService.findProposalView(
    req.query.id as string
  );
  return res.status(HttpStatus.OK).json(proposal);
});

export default handler;
