import { useRouter } from 'next/router';
import { useProposal } from '@/app/api/proposals';
import { Alert, Box, Container } from '@mantine/core';
import { ProposalStatus } from '@/core/types';
import { IconCheck } from '@tabler/icons';
import { formatDate } from '@/core/utils';
import PageContainer from '@/app/components/layouts/PageContainer';
import ProposalDetailsHeader from '@/app/components/proposals/ProposalDetailsHeader';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import ProposalPreview from '@/app/components/proposals/ProposalPreview';

export default function ProposalDetails() {
  const { query, push } = useRouter();
  const { data: proposal, isLoading } = useProposal(query.id as string);
  return (
    <PageContainer header={!isLoading && <ProposalDetailsHeader />}>
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Box>
          <Container size={850} className="space-y-3">
            {proposal?.status === ProposalStatus.APPROVED && (
              <Alert icon={<IconCheck size={16} />} color="green">
                {proposal?.approver === 'manual' ? 'You' : proposal?.approver}{' '}
                approved this proposal on {formatDate(proposal?.approvalDate)}
              </Alert>
            )}
            <ProposalPreview proposal={proposal} />
          </Container>
        </Box>
      )}
    </PageContainer>
  );
}
