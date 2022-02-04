import {
  useClientAddMutation,
  useClientDeleteManyMutation,
  useClientDeleteMutation,
  useClients,
} from '@/app/api/clients';
import { Box, Container, Group, Paper, Title, Text, ActionIcon } from '@mantine/core';
import { useMemo, useState } from 'react';
import { FiPlus, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';
import { useToggle } from 'react-use';
import { formatClients } from '@/app/utils/formatters/formatClients';
import { isEmpty } from 'lodash';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import DataTable from '@/app/components/shared/DataTable';
import Avatar from '@/app/components/shared/Avatar';
import ClientCreateModal from '@/app/components/clients/ClientCreateModal';
import Link from '@/app/components/shared/Link';
import DeleteModal from '@/app/components/shared/DeleteModal';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import EmptyState from '@/app/components/shared/EmptyState';

export default function ClientsPage() {
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);
  const [openDeleteManyDialog, toggleOpenDeleteManyDialog] = useToggle(false);
  const [open, toggleOpen] = useToggle(false);
  const { isLoading, data: clients } = useClients();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');

  const handleClientSubmit = useClientAddMutation();
  const handleDeleteClient = useClientDeleteMutation();
  const handleDeleteClients = useClientDeleteManyMutation(selectedIds);

  function openDeleteOneModal(id: string) {
    setSelectedId(id);
    toggleOpenDeleteDialog();
  }

  async function onDeleteClient() {
    try {
      await handleDeleteClient.mutateAsync(selectedId);
      setSelectedId('');
    } catch (error) {
      console.log(error);
    }
  }

  async function onDeleteClients() {
    await handleDeleteClients.mutateAsync();
    setSelectedIds([]);
  }

  const data = useMemo(() => formatClients(clients?.data), [clients?.data]);

  console.log({ data });

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'fullName',
        Cell: ({ value, row }) => (
          <Link to={`/clients/${row.original.id}`}>
            <Box className="flex items-center space-x-2">
              <Avatar radius="xl" backgroundColor={row.original?.backgroundColor}>
                {row.original.initials}
              </Avatar>
              <Text className="font-semibold hover:underline">{value}</Text>
            </Box>
          </Link>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone number',
        accessor: 'phone',
      },
      {
        Header: 'Company name',
        accessor: 'company',
      },
      {
        Header: 'Date created',
        accessor: 'createdAt',
      },
      {
        Header: 'Actions',
        accessor: 'updatedAt',
        Cell: ({ value, row }) => (
          <Box className="flex space-x-1">
            <Link to={`/clients/${row.original.id}`}>
              <ActionIcon title="View">
                <FiEye />
              </ActionIcon>
            </Link>
            <ActionIcon
              title="Delete"
              color="red"
              onClick={() => openDeleteOneModal(row.original.id)}
            >
              <FiTrash2 />
            </ActionIcon>
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
              <Title order={1}>Clients</Title>
              <Group spacing="xs">
                <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                  Add client
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              {!isEmpty(clients?.data) && (
                <DataTable
                  columns={columns}
                  data={data}
                  setSelectedIds={setSelectedIds}
                  searchPlaceholder="Search clients"
                  onDeleteClick={toggleOpenDeleteManyDialog}
                />
              )}
              {isEmpty(clients?.data) && (
                <Paper withBorder className="p-0 border-gray-600 border-opacity-20 shadow-sm">
                  <Box className="py-7">
                    <EmptyState
                      title="There are no clients yet"
                      icon={<FiUsers size="50px" />}
                      actionButton={
                        <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                          Add Client
                        </Button>
                      }
                    />
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
        </Container>
      )}

      <ClientCreateModal
        opened={open}
        onClose={toggleOpen}
        submit={handleClientSubmit.mutateAsync}
      />

      <DeleteModal
        opened={openDeleteDialog}
        onClose={toggleOpenDeleteDialog}
        isLoading={handleDeleteClient.isLoading}
        onDelete={onDeleteClient}
        title="Client"
      />

      <DeleteModal
        opened={openDeleteManyDialog}
        onClose={toggleOpenDeleteManyDialog}
        isLoading={handleDeleteClients.isLoading}
        onDelete={onDeleteClients}
        title="Client"
      />
    </PageLayout>
  );
}
