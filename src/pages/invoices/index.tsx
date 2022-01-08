import { useMemo, useState } from 'react';
import { Box, Container, Group, Title, Paper, Text, ActionIcon } from '@mantine/core';
import { FiPlus, FiEdit, FiEye } from 'react-icons/fi';
import { IoReceiptOutline } from 'react-icons/io5';
import { useInvoiceAddMutation, useInvoiceDeleteManyMutation, useInvoices } from '@/api/invoices';
import { isEmpty } from 'lodash';
import { formatInvoices } from '@/utils';
import { useDialog } from '@/hooks';
import { InvoiceStatus } from '@/types';
import Link from '@/components/shared/Link';
import DeleteModal from '@/components/shared/DeleteModal';
import PageLayout from '@/components/layouts/PageLayout';
import Button from '@/components/shared/Button';
import DataTable from '@/components/shared/DataTable';
import InvoiceCreateModal from '@/components/invoices/InvoiceCreateModal';
import InvoiceActionsMenu from '@/components/invoices/InvoiceActionsMenu';
import InvoiceStatusBadge from '@/components/invoices/InvoiceStatusBadge';
import LoadingLoader from '@/components/shared/LoadingLoader';
import EmptyState from '@/components/shared/EmptyState';

export default function InvoicesPage() {
  const [openModal, toggleOpenModal, closeModal] = useDialog();
  const [openDeleteManyModal, toggleOpenDeleteManyModal, closeDeleteManyModal] = useDialog();
  const { data: invoices, isLoading } = useInvoices();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleInvoiceSubmit = useInvoiceAddMutation();
  const handelDeleteInvoices = useInvoiceDeleteManyMutation(selectedIds);

  const onDeleteInvoices = async () => {
    await handelDeleteInvoices.mutateAsync();
    setSelectedIds([]);
  };

  const data = useMemo(() => formatInvoices(invoices?.data), [invoices?.data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Invoice no',
        accessor: 'invoiceNumber',
        Cell: ({ value, row }) => (
          <Link
            to={`/invoices/${row.original.id}/${
              row.original.status === InvoiceStatus.DRAFT ? 'edit' : 'details'
            }`}
          >
            <Text className="font-semibold hover:underline">{value}</Text>
          </Link>
        ),
      },
      {
        Header: 'Client',
        accessor: 'toName',
      },
      {
        Header: 'Issued on',
        accessor: 'issuedOn',
      },
      {
        Header: 'Due on',
        accessor: 'dueOn',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <InvoiceStatusBadge status={value} />,
      },
      {
        Header: 'Actions',
        accessor: 'updatedAt',
        Cell: ({ value, row }) => (
          <Box className="flex items-center space-x-1">
            {row.original.status === InvoiceStatus.DRAFT && (
              <Link to={`/invoices/${row.original.id}/edit`}>
                <ActionIcon color="green" title="Edit">
                  <FiEdit />
                </ActionIcon>
              </Link>
            )}
            {row.original.status !== InvoiceStatus.DRAFT && (
              <Link to={`/invoices/${row.original.id}/details`}>
                <ActionIcon title="View details">
                  <FiEye />
                </ActionIcon>
              </Link>
            )}
            <InvoiceActionsMenu id={row.original.id} status={row.original.status} />
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <PageLayout>
      {isLoading && <LoadingLoader height="90vh" />}

      {!isLoading && (
        <Container size="xl">
          <Box>
            <Box className="flex justify-between items-center">
              <Title order={1}>Invoices</Title>
              <Group spacing="xs">
                <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpenModal}>
                  Add invoice
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              <Paper shadow="xs" withBorder>
                {!isEmpty(invoices?.data) && (
                  <DataTable
                    columns={columns}
                    data={data}
                    setSelectedIds={setSelectedIds}
                    searchPlaceholder="Search invoices"
                    onDeleteClick={toggleOpenDeleteManyModal}
                  />
                )}
                {isEmpty(invoices?.data) && (
                  <Box className="py-7">
                    <EmptyState
                      title="There are no invoices yet"
                      icon={<IoReceiptOutline size="50px" />}
                      actionButton={
                        <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpenModal}>
                          Add invoice
                        </Button>
                      }
                    />
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      )}

      <InvoiceCreateModal
        opened={openModal}
        onClose={closeModal}
        submit={handleInvoiceSubmit.mutateAsync}
        isLoading={handleInvoiceSubmit.isLoading}
      />

      <DeleteModal
        title="Invoice"
        opened={openDeleteManyModal}
        onClose={closeDeleteManyModal}
        isLoading={handelDeleteInvoices.isLoading}
        onDelete={onDeleteInvoices}
      />
    </PageLayout>
  );
}
