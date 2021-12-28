import {
  useClientAddMutation,
  useClientDeleteManyMutation,
  useClientDeleteMutation,
  useClients,
} from '@/api/clients';
import { Box, Container, Group, Paper, Title, Text, ActionIcon } from '@mantine/core';
import { useMemo, useState } from 'react';
import { FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import { useToggle } from 'react-use';
import { formatClients } from '@/utils/formatters/formatClients';
import PageLayout from '@/components/layouts/PageLayout';
import Button from '@/components/shared/Button';
import Search from '@/components/shared/Search';
import DataTable from '@/components/shared/DataTable';
import Avatar from '@/components/shared/Avatar';
import ClientCreateModal from '@/components/clients/ClientCreateModal';
import Link from '@/components/shared/Link';
import DeleteModal from '@/components/shared/DeleteModal';
import LoadingLoader from '@/components/shared/LoadingLoader';

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

  console.log({ clients: clients?.data });

  const data = useMemo(() => formatClients(clients?.data), [clients?.data]);

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
                <Search placeholder="Search clients" />
                <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                  Add Client
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              {selectedIds.length > 0 && (
                <Box className="mb-3 flex items-center space-x-2">
                  <Button leftIcon={<FiTrash2 />} color="red" onClick={toggleOpenDeleteManyDialog}>
                    Delete
                  </Button>
                </Box>
              )}
              <Paper shadow="sm" className="p-0" withBorder>
                <DataTable columns={columns} data={data} setSelectedIds={setSelectedIds} />
              </Paper>
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
