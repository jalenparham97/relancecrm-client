import { useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import { Box, Container, Group, Paper, Title, Text, ActionIcon } from '@mantine/core';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  useFormAddMutation,
  useFormDeleteManyMutation,
  useFormDeleteMutation,
  useForms,
} from '@/app/api/forms';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import DataTable from '@/app/components/shared/DataTable';
import Link from '@/app/components/shared/Link';
import DeleteModal from '@/app/components/shared/DeleteModal';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import EmptyState from '@/app/components/shared/EmptyState';
import FormCreateModal from '@/app/components/forms/FormCreateModal';
import { formatForms } from '@/app/utils';
import { isEmpty } from 'lodash';

export default function FormsPage() {
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);
  const [openDeleteManyDialog, toggleOpenDeleteManyDialog] = useToggle(false);
  const [open, toggleOpen] = useToggle(false);
  const { isLoading, data: forms } = useForms();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');

  const handleFormSubmit = useFormAddMutation();
  const handleDeleteForm = useFormDeleteMutation();
  const handleDeleteForms = useFormDeleteManyMutation(selectedIds);

  function openDeleteOneModal(id: string) {
    setSelectedId(id);
    toggleOpenDeleteDialog();
  }

  async function onDeleteForm() {
    try {
      await handleDeleteForm.mutateAsync(selectedId);
      setSelectedId('');
    } catch (error) {
      console.log(error);
    }
  }

  async function onDeleteForms() {
    await handleDeleteForms.mutateAsync();
    setSelectedIds([]);
  }

  const data = useMemo(() => formatForms(forms?.data), [forms?.data]);

  console.log({ data });

  const columns = useMemo(
    () => [
      {
        Header: 'Form name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <Link to={`/forms/${row.original.id}/edit`}>
            <Box className="flex items-center space-x-2">
              <Text className="font-semibold hover:underline">{value}</Text>
            </Box>
          </Link>
        ),
      },
      {
        Header: 'Responses',
        accessor: 'responsesCount',
      },
      {
        Header: 'Date created',
        accessor: 'createdAt',
      },
      {
        Header: 'Date modified',
        accessor: 'updatedAt',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value, row }) => (
          <Box className="flex space-x-1">
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
              <Title order={1}>Forms</Title>
              <Group spacing="xs">
                <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                  Add form
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              <Paper withBorder className="p-0 border-gray-600 border-opacity-20 shadow-sm">
                {!isEmpty(forms?.data) && (
                  <DataTable
                    columns={columns}
                    data={data}
                    setSelectedIds={setSelectedIds}
                    searchPlaceholder="Search forms"
                    onDeleteClick={toggleOpenDeleteManyDialog}
                  />
                )}
                {isEmpty(forms?.data) && (
                  <Box className="py-7">
                    <EmptyState
                      title="There are no forms yet"
                      icon={<i className="fi fi-rr-form text-4xl" />}
                      actionButton={
                        <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                          Add form
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

      <FormCreateModal
        opened={open}
        onClose={toggleOpen}
        // submit={handleClientSubmit.mutateAsync}
      />

      <DeleteModal
        opened={openDeleteDialog}
        onClose={toggleOpenDeleteDialog}
        isLoading={handleDeleteForm.isLoading}
        onDelete={onDeleteForm}
        title="Form"
      />

      <DeleteModal
        opened={openDeleteManyDialog}
        onClose={toggleOpenDeleteManyDialog}
        isLoading={handleDeleteForms.isLoading}
        onDelete={onDeleteForms}
        title="Form"
      />
    </PageLayout>
  );
}
