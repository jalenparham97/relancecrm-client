import { useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { isEqual } from 'lodash';
import { ActionIcon, Box, Group, Header, Title } from '@mantine/core';
import { FiArrowLeft, FiSave, FiSend, FiEye, FiEyeOff } from 'react-icons/fi';
import {
  IconCheck,
  IconSend,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
} from '@tabler/icons';
import { useIsDarkMode, useToasts, useDialog } from '@/app/hooks';
import { useUser } from '@/app/api/auth';
import {
  useInvoiceSend,
  useInvoiceSendTest,
  useInvoiceUpdateMutation,
} from '@/app/api/invoices';
import { CreateInvoice, Invoice } from '@/core/types';
import { getInvoiceSubtotal, getInvoiceTotal } from '@/app/utils';
import { createInvoiceState, proposalState } from '@/app/store';
import Button from '@/app/components/shared/Button';
// import InvoiceStatusBadge from './InvoiceStatusBadge';
import UnsavedDataModal from '@/app/components/shared/UnsavedDataModal';
import { useProposal } from '@/app/api/proposals';
// import InvoiceSendModal from './InvoiceSendModal';

interface Props {
  openPreview?: boolean;
  toggleOpenPreview?: () => void;
  invoiceData?: Invoice;
}

export default function ProposalEditHeader({
  openPreview,
  toggleOpenPreview,
  invoiceData,
}: Props) {
  const user = useUser();
  const toasts = useToasts();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const proposal = useRecoilValue(proposalState);
  const { data: proposalData } = useProposal(router.query.id as string);
  const [openSendDialog, toggleOpenSendDialog] = useToggle(false);
  const [unsavedModal, openUnsavedModal, closeUnsavedModal] = useDialog();
  const [sendUserCopy, setSendUserCopy] = useState(false);
  const [message, setMessage] = useState('');
  const { send, isLoading, error, resetError } = useInvoiceSend();
  const {
    sendTest,
    isLoading: testLoading,
    error: testError,
    resetError: testResetError,
  } = useInvoiceSendTest();

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
          <Title order={2}>Edit Proposal</Title>
          {/* {invoice && <InvoiceStatusBadge status={invoice?.status} />} */}
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
            // loading={handleUpdateInvoiceSubmit.isLoading}
            // onClick={updateInvoice}
          >
            Mark as approved
          </Button>
          <Button
            leftIcon={<IconSend size={16} />}
            onClick={toggleOpenSendDialog}
          >
            Send proposal
          </Button>
        </Group>
      </Box>

      <UnsavedDataModal opened={unsavedModal} onClose={closeUnsavedModal} />

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
