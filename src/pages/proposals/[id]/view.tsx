import { useRouter } from 'next/router';
import { useProposalView } from '@/app/api/proposals';
import { Alert, Box, Container } from '@mantine/core';
import { ProposalStatus } from '@/core/types';
import { IconCheck } from '@tabler/icons';
import { formatDate } from '@/core/utils';
import PageContainer from '@/app/components/layouts/PageContainer';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import ProposalPreview from '@/app/components/proposals/ProposalPreview';
import ProposalViewHeader from '@/app/components/proposals/ProposalViewHeader';

export default function ProposalView() {
  const { query, push } = useRouter();
  const { data: proposal, isLoading } = useProposalView(query.id as string);
  return (
    <PageContainer header={!isLoading && <ProposalViewHeader />}>
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Box>
          <Container size={850} className="space-y-4">
            {proposal?.status === ProposalStatus.APPROVED && (
              <Alert icon={<IconCheck size={16} />} color="green">
                {proposal?.approver === 'manual' ? 'You' : proposal?.approver}{' '}
                approved this proposal on {formatDate(proposal?.approvalDate)}
              </Alert>
            )}
            {proposal?.status === ProposalStatus.DECLINED && (
              <Alert color="red">
                {proposal?.decliner} declined this proposal on{' '}
                {formatDate(proposal?.declineDate)}
              </Alert>
            )}
            <ProposalPreview proposal={proposal} />
          </Container>
        </Box>
      )}
    </PageContainer>
  );
}
