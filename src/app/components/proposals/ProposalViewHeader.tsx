import { useRouter } from 'next/router';
import { Box, Group, Header, Title, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { useDialog } from '@/app/hooks';
import { ProposalStatus } from '@/core/types';
import {
  useProposalUpdateMutation,
  useProposalView,
} from '@/app/api/proposals';
import Button from '@/app/components/shared/Button';
import ProposalStatusBadge from './ProposalStatusBadge';
import ProposalClientAcceptModal from './ProposalClientAcceptModal';
import ProposalClientDeclineModal from './ProposalClientDeclineModal';

interface Props {}

export default function ProposalViewHeader({}: Props) {
  const router = useRouter();
  const { data: proposal } = useProposalView(router.query.id as string);
  const [approveModal, openApproveModal, closeApproveModal] = useDialog();
  const [declineModal, openDeclineModal, closeDeclineModal] = useDialog();

  const handleUpdateProposal = useProposalUpdateMutation(proposal?._id);

  const handleProposalAccept = async (name: string) => {
    try {
      await handleUpdateProposal.mutateAsync({
        status: ProposalStatus.APPROVED,
        approver: name,
        approvalDate: new Date().toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleProposalDecline = async (name: string) => {
    try {
      await handleUpdateProposal.mutateAsync({
        status: ProposalStatus.DECLINED,
        decliner: name,
        declineDate: new Date().toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Header
      height={70}
      p="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Group align="center" spacing="lg">
          <Box>
            <Title order={4}>{proposal?.title}</Title>
            <Text></Text>
          </Box>
          {proposal && <ProposalStatusBadge status={proposal?.status} />}
        </Group>
        <Group align="center">
          {proposal?.status !== ProposalStatus.APPROVED &&
            proposal?.status !== ProposalStatus.DECLINED && (
              <>
                <Button color="green" onClick={openApproveModal}>
                  Accept
                </Button>
                <Button variant="default" onClick={openDeclineModal}>
                  Decline
                </Button>
              </>
            )}
          <Button variant="default" leftIcon={<IconDownload size={16} />}>
            Download
          </Button>
        </Group>
      </Box>

      <ProposalClientAcceptModal
        opened={approveModal}
        onClose={closeApproveModal}
        onSubmitApprove={handleProposalAccept}
        isLoading={handleUpdateProposal.isLoading}
      />
      <ProposalClientDeclineModal
        opened={declineModal}
        onClose={closeDeclineModal}
        onSubmitDecline={handleProposalDecline}
        isLoading={handleUpdateProposal.isLoading}
      />
    </Header>
  );
}
