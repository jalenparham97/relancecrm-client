import { useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { isEqual } from 'lodash';
import { ActionIcon, Box, Group, Header, Title } from '@mantine/core';
import { FiArrowLeft, FiSave, FiSend, FiEye, FiEyeOff } from 'react-icons/fi';
import { useIsDarkMode, useToasts } from '@/app/hooks';
import { useUser } from '@/app/api/auth';
import { useInvoiceSend, useInvoiceSendTest, useInvoiceUpdateMutation } from '@/app/api/invoices';
import { CreateInvoice, Invoice } from '@/core/types';
import { getInvoiceSubtotal, getInvoiceTotal } from '@/app/utils';
import { createInvoiceState } from '@/app/store';
import Button from '@/app/components/shared/Button';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import UnsavedDataModal from '@/app/components/shared/UnsavedDataModal';
import { useDialog } from '@/app/hooks/useDialog';
import InvoiceSendModal from './InvoiceSendModal';

interface Props {
  openPreview?: boolean;
  toggleOpenPreview?: () => void;
  invoiceData?: Invoice;
}

export default function InvoiceEditHeader({ openPreview, toggleOpenPreview, invoiceData }: Props) {
  const user = useUser();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const invoice = useRecoilValue(createInvoiceState);
  const toasts = useToasts();
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

  const handleSendInvoice = async () => {
    return await send({
      invoice,
      from: getFrom(),
      sendUserCopy,
      message,
      recipients: invoice?.recipients?.map((client) => client.email) || [],
    });
  };

  const handleSendInvoiceTest = async () => {
    return await sendTest(invoice);
  };

  const handleUpdateInvoiceSubmit = useInvoiceUpdateMutation<CreateInvoice>(invoice?._id);

  const updateInvoice = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({
        ...invoice,
        client: invoice.client?._id,
        project: invoice.project?._id,
        subtotal: getInvoiceSubtotal(invoice?.items),
        total: getInvoiceTotal({ ...invoice }),
      } as CreateInvoice);
      toasts.success('Invoice Updated');
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    if (isEqual(invoiceData, invoice)) {
      router.back();
    } else {
      openUnsavedModal();
    }
  };

  return (
    <Header
      height={70}
      padding="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Group align="center">
          <ActionIcon size="lg" onClick={handleBack}>
            <FiArrowLeft size="20px" />
          </ActionIcon>
          <Title order={2}>Edit Invoice</Title>
          {invoice && <InvoiceStatusBadge status={invoice?.status} />}
        </Group>
        <Group align="center">
          <Button
            variant={isDarkMode ? 'outline' : 'default'}
            color="gray"
            leftIcon={openPreview ? <FiEyeOff /> : <FiEye />}
            onClick={toggleOpenPreview}
          >
            {openPreview ? 'Exit preview' : 'Preview'}
          </Button>
          <Button
            variant={isDarkMode ? 'default' : 'filled'}
            color={isDarkMode ? 'gray' : 'dark'}
            leftIcon={<FiSave />}
            loading={handleUpdateInvoiceSubmit.isLoading}
            onClick={updateInvoice}
          >
            Save changes
          </Button>
          <Button leftIcon={<FiSend />} onClick={toggleOpenSendDialog}>
            Send invoice
          </Button>
        </Group>
      </Box>

      <UnsavedDataModal opened={unsavedModal} onClose={closeUnsavedModal} />

      <InvoiceSendModal
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
      />
    </Header>
  );
}
