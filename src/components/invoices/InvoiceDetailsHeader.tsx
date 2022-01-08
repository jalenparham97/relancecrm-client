import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { ActionIcon, Box, Group, Header, Title, Text } from '@mantine/core';
import { FiArrowLeft, FiDollarSign, FiDownload } from 'react-icons/fi';
import { useIsDarkMode } from '@/hooks/useIsDarkMode';
import { useInvoiceUpdateMutation } from '@/api/invoices';
import { CreateInvoice, Invoice, InvoiceStatus } from '@/types';
import { formatCurrency, formatDate } from 'utils';
import Button from '@/components/shared/Button';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { useDialog } from '@/hooks/useDialog';
import dayjs from 'dayjs';
import InvoiceMarkAsPaidModal from './InvoiceMarkAsPaidModal';

interface Props {
  invoice?: Invoice;
}

export default function InvoiceDetailsHeader({ invoice }: Props) {
  const router = useRouter();
  const [openMPDialog, toggleMPOpenDialog] = useToggle(false);

  const handleUpdateInvoiceSubmit = useInvoiceUpdateMutation<CreateInvoice>(invoice?._id);

  const markInvoiceAsPaid = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({
        status: InvoiceStatus.PAID,
        paymentDate: dayjs().toISOString(),
        paymentDetails: { paymentMethod: 'manual' },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Header
      height={80}
      padding="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Group align="center" spacing="xl">
          <ActionIcon size="lg" onClick={() => router.back()}>
            <FiArrowLeft size="20px" />
          </ActionIcon>
          <Box>
            <Title order={4}>
              Invoice to: {invoice?.toName} - {formatCurrency(invoice?.total)}
            </Title>
            <Text>
              Issued on: {formatDate(invoice?.issuedOn)} - Due on: {formatDate(invoice?.dueOn)}
            </Text>
          </Box>
          {invoice && <InvoiceStatusBadge status={invoice?.status} />}
        </Group>
        <Group align="center">
          {invoice?.status !== InvoiceStatus.PAID && (
            <Button variant="default" leftIcon={<FiDollarSign />} onClick={toggleMPOpenDialog}>
              Mark as paid
            </Button>
          )}
          <Button leftIcon={<FiDownload />}>Download</Button>
        </Group>
      </Box>

      <InvoiceMarkAsPaidModal
        opened={openMPDialog}
        onClose={toggleMPOpenDialog}
        onSubmit={markInvoiceAsPaid}
        isLoading={handleUpdateInvoiceSubmit.isLoading}
      />
    </Header>
  );
}
