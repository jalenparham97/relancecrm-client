import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { HttpStatus, ProposalEmailData } from '@/core/types';
import { ExtendedApiRequest } from '@/server/types';
import { requireAuth } from '@/server/middleware';
import { proposalsService } from '@/server/services/proposals.service';

const handler = nc<ExtendedApiRequest, NextApiResponse>();

handler.use(requireAuth);

handler.post(async (req, res) => {
  const emailOptions: ProposalEmailData = req.body;
  await proposalsService.sendProposalEmail(emailOptions, req.user);
  return res.status(HttpStatus.OK).send({ message: 'sent' });
});

export default handler;
