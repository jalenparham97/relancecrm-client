import { Group, Paper, Box, Text, ActionIcon, Title } from '@mantine/core';
import { FiTrash2 } from 'react-icons/fi';
import { Client, Invoice, InvoiceStatus } from '@/core/types';
import { formatCurrency, formatDate } from '@/app/utils';
import { useInvoiceIdDeleteMutation } from '@/app/api/invoices';
import Link from '@/app/components/shared/Link';
import DeleteModal from '@/app/components/shared/DeleteModal';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { useDialog } from '@/app/hooks';

interface Props {
  invoice: Invoice;
  client: Client;
}

export default function InvoiceItem({ invoice, client }: Props) {
  const [deleteModal, openDeleteModal, closeDeleteModal] = useDialog();

  const handleInvoiceDelete = useInvoiceIdDeleteMutation(client?._id);

  const onDelete = async () => {
    await handleInvoiceDelete.mutateAsync(invoice?._id);
  };

  return (
    <Paper
      p="md"
      withBorder
      className="border-gray-600 border-opacity-30 shadow-sm"
    >
      <Group position="apart">
        <Link
          to={`/invoices/${invoice._id}/${
            invoice.status === InvoiceStatus.DRAFT ? 'edit' : 'details'
          }`}
        >
          <Box className="space-y-1">
            <Group align="center">
              <Title order={3}>Invoice #: {invoice.invoiceNumber}</Title>
              <InvoiceStatusBadge status={invoice.status} />
            </Group>
            <Group>
              <Text>Total: {formatCurrency(invoice.total)}</Text>
              <Text>Due on: {formatDate(invoice.dueOn)}</Text>
            </Group>
          </Box>
        </Link>
        <ActionIcon color="red" onClick={openDeleteModal}>
          <FiTrash2 />
        </ActionIcon>
      </Group>

      <DeleteModal
        opened={deleteModal}
        onClose={closeDeleteModal}
        isLoading={handleInvoiceDelete.isLoading}
        onDelete={onDelete}
        title="Invoice"
      />
    </Paper>
  );
}
