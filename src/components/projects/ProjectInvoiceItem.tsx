import { Group, Paper, Box, Text, ActionIcon, Title } from '@mantine/core';
import { FiTrash2 } from 'react-icons/fi';
import { Invoice, InvoiceStatus, Project } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import { useInvoiceIdDeleteMutation } from '@/api/invoices';
import { useDialog } from '@/hooks';
import Link from '@/components/shared/Link';
import DeleteModal from '@/components/shared/DeleteModal';
import InvoiceStatusBadge from '@/components/invoices/InvoiceStatusBadge';

interface Props {
  invoice: Invoice;
  project: Project;
}

export default function ProjectInvoiceItem({ invoice, project }: Props) {
  const [deleteModal, openDeleteModal, closeDeleteModal] = useDialog();

  const handleInvoiceDelete = useInvoiceIdDeleteMutation(project?._id);

  const onDelete = async () => {
    await handleInvoiceDelete.mutateAsync(invoice?._id);
  };

  return (
    <Paper withBorder padding="md" className="border-gray-600 border-opacity-30">
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
