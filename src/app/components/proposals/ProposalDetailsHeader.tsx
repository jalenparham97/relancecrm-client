import { useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { isEqual } from 'lodash';
import { ActionIcon, Box, Group, Header, Title, Text } from '@mantine/core';
import {
  IconCheck,
  IconSend,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconEdit,
  IconPencil,
  IconArchiveOff,
  IconArchive,
} from '@tabler/icons';
import { useIsDarkMode, useToasts, useDialog } from '@/app/hooks';
import { useUser } from '@/app/api/auth';
import {
  useInvoiceSend,
  useInvoiceSendTest,
  useInvoiceUpdateMutation,
} from '@/app/api/invoices';
import { CreateInvoice, Invoice, ProposalStatus } from '@/core/types';
import { getInvoiceSubtotal, getInvoiceTotal } from '@/app/utils';
import { createInvoiceState, proposalState } from '@/app/store';
import { useProposal, useProposalUpdateMutation } from '@/app/api/proposals';
import Button from '@/app/components/shared/Button';
import UnsavedDataModal from '@/app/components/shared/UnsavedDataModal';
import ProposalApproveModal from './ProposalApproveModal';
import ProposalStatusBadge from './ProposalStatusBadge';
import ArchiveModal from '../shared/ArchiveModal';
import ProposalSendModal from './ProposalSendModal';

interface Props {
  openPreview?: boolean;
  toggleOpenPreview?: () => void;
  invoiceData?: Invoice;
}

export default function ProposalDetailsHeader({
  openPreview,
  toggleOpenPreview,
  invoiceData,
}: Props) {
  const user = useUser();
  const toasts = useToasts();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { data: proposal } = useProposal(router.query.id as string);
  const [unsavedModal, openUnsavedModal, closeUnsavedModal] = useDialog();
  const [approveModal, openApproveModal, closeApproveModal] = useDialog();
  const [archiveModal, openArchiveModal, closeArchiveModal] = useDialog();
  const [sendModal, openSendModal, closeSendModal] = useDialog();
  const [sendUserCopy, setSendUserCopy] = useState(false);
  const [message, setMessage] = useState('');
  const { send, isLoading, error, resetError } = useInvoiceSend();
  const {
    sendTest,
    isLoading: testLoading,
    error: testError,
    resetError: testResetError,
  } = useInvoiceSendTest();

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

  const handleArchive = async () => {
    try {
      await handleUpdateProposal.mutateAsync({
        isArchived: !proposal?.isArchived,
      });
      closeArchiveModal();
    } catch (error) {
      console.log(error);
    }
  };

  const getFrom = () => {
    if (user?.businessInfo?.businessName) {
      return `${user?.fullName} at ${user?.businessInfo.businessName}`;
    }
    return user?.fullName;
  };

  // const handleSendInvoice = async () => {
  //   return await send({
  //     invoice,
  //     from: getFrom(),
  //     sendUserCopy,
  //     message,
  //     recipients: invoice?.recipients?.map((client) => client.email) || [],
  //   });
  // };

  // const handleSendInvoiceTest = async () => {
  //   return await sendTest(invoice);
  // };

  // const handleUpdateInvoiceSubmit = useInvoiceUpdateMutation<CreateInvoice>(
  //   invoice?._id
  // );

  // const updateInvoice = async () => {
  //   try {
  //     await handleUpdateInvoiceSubmit.mutateAsync({
  //       ...invoice,
  //       client: invoice.client?._id,
  //       project: invoice.project?._id,
  //       subtotal: getInvoiceSubtotal(invoice?.items),
  //       total: getInvoiceTotal({ ...invoice }),
  //     } as CreateInvoice);
  //     toasts.success('Invoice updated');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleBack = () => {
    router.back();
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
          <ActionIcon size="lg" onClick={handleBack}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Box>
            <Title order={4}>{proposal?.title}</Title>
            <Text></Text>
          </Box>
          {proposal && (
            <ProposalStatusBadge
              status={
                proposal?.isArchived
                  ? ProposalStatus.ARCHIVED
                  : proposal?.status
              }
            />
          )}
        </Group>
        {proposal?.isArchived ? (
          <Group align="center">
            <Button
              variant="default"
              leftIcon={<IconArchiveOff size={16} />}
              onClick={handleArchive}
              loading={handleUpdateProposal.isLoading}
            >
              Unarchive
            </Button>
          </Group>
        ) : (
          <>
            {proposal?.status === ProposalStatus.APPROVED ? (
              <Group align="center">
                {/* <Button color="green">Create an invoice</Button> */}
                <Button
                  leftIcon={<IconArchive size={16} />}
                  variant="default"
                  onClick={openArchiveModal}
                >
                  Archive
                </Button>
              </Group>
            ) : (
              <Group align="center">
                <Button
                  variant="default"
                  leftIcon={<IconCheck size={16} />}
                  onClick={openApproveModal}
                >
                  Mark as approved
                </Button>
                <Button
                  to={`/proposals/${router.query.id}/edit`}
                  variant="default"
                  color="gray"
                  leftIcon={<IconPencil size={16} />}
                  onClick={toggleOpenPreview}
                >
                  Edit
                </Button>
              </Group>
            )}
          </>
        )}
      </Box>

      <UnsavedDataModal opened={unsavedModal} onClose={closeUnsavedModal} />

      <ProposalApproveModal
        opened={approveModal}
        onClose={closeApproveModal}
        onSubmit={handleMarkApproved}
        isLoading={handleUpdateProposal.isLoading}
      />

      <ArchiveModal
        title="Proposal"
        opened={archiveModal}
        onClose={closeArchiveModal}
        onSubmit={handleArchive}
        isLoading={handleUpdateProposal.isLoading}
      />

      {/* <InvoiceSendModal
        opened={openSendDialog}
        onClose={toggleOpenSendDialog}
        onSubmit={handleSendInvoice}
        loading={isLoading}
        error={error}
        resetError={resetError}
        onSubmitTest={handleSendInvoiceTest}
        testLoading={testLoading}
        testError={testError}
        testResetError={testResetError}
        sendUserCopy={sendUserCopy}
        setSendUserCopy={setSendUserCopy}
        message={message}
        setMessage={setMessage}
      /> */}
    </Header>
  );
}
