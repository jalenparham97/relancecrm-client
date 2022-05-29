import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { isEqual } from 'lodash';
import { ActionIcon, Box, Group, Header, Title } from '@mantine/core';
import {
  IconCheck,
  IconSend,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
} from '@tabler/icons';
import { useIsDarkMode, useToasts, useDialog } from '@/app/hooks';
import { Invoice, ProposalStatus } from '@/core/types';
import { proposalState } from '@/app/store';
import Button from '@/app/components/shared/Button';
import UnsavedDataModal from '@/app/components/shared/UnsavedDataModal';
import { useProposal, useProposalUpdateMutation } from '@/app/api/proposals';
import ProposalApproveModal from './ProposalApproveModal';
import ProposalSendModal from './ProposalSendModal';
import ProposalStatusBadge from './ProposalStatusBadge';

interface Props {
  openPreview?: boolean;
  toggleOpenPreview?: () => void;
  invoiceData?: Invoice;
}

export default function ProposalEditHeader({
  openPreview,
  toggleOpenPreview,
}: Props) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const proposal = useRecoilValue(proposalState);
  const { data: proposalData } = useProposal(router.query.id as string);
  const [unsavedModal, openUnsavedModal, closeUnsavedModal] = useDialog();
  const [approveModal, openApproveModal, closeApproveModal] = useDialog();
  const [sendModal, openSendModal, closeSendModal] = useDialog();

  const handleUpdateProposal = useProposalUpdateMutation(proposal?._id);

  const handleMarkApproved = async () => {
    try {
      await handleUpdateProposal.mutateAsync({
        status: ProposalStatus.APPROVED,
      });
      router.push('/proposals');
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    if (isEqual(proposalData, proposal)) {
      router.back();
    } else {
      openUnsavedModal();
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
        <Group align="center">
          <ActionIcon size="lg" onClick={handleBack}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={4}>Edit Proposal</Title>
          {proposal && <ProposalStatusBadge status={proposal?.status} />}
        </Group>
        <Group align="center">
          <Button
            variant={isDarkMode ? 'outline' : 'default'}
            color="gray"
            leftIcon={
              openPreview ? <IconEyeOff size={16} /> : <IconEye size={16} />
            }
            onClick={toggleOpenPreview}
          >
            {openPreview ? 'Exit preview' : 'Preview'}
          </Button>
          <Button
            variant="default"
            color={isDarkMode ? 'gray' : 'dark'}
            leftIcon={<IconCheck size={16} />}
            onClick={openApproveModal}
          >
            Mark as approved
          </Button>
          <Button leftIcon={<IconSend size={16} />} onClick={openSendModal}>
            Send proposal
          </Button>
        </Group>
      </Box>

      <UnsavedDataModal opened={unsavedModal} onClose={closeUnsavedModal} />

      <ProposalApproveModal
        opened={approveModal}
        onClose={closeApproveModal}
        onSubmit={handleMarkApproved}
        isLoading={handleUpdateProposal.isLoading}
      />

      <ProposalSendModal opened={sendModal} onClose={closeSendModal} />
    </Header>
  );
}
