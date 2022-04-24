import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { Box, Container, Group, Paper, Title, Text } from '@mantine/core';
import { IconPlus, IconClipboardText } from '@tabler/icons';
import {
  useFormAddMutation,
  useFormDeleteManyMutation,
  useForms,
} from '@/app/api/forms';
import { formatForms } from '@/app/utils';
import { isEmpty } from 'lodash';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import DataTable from '@/app/components/shared/DataTable';
import Link from '@/app/components/shared/Link';
import DeleteModal from '@/app/components/shared/DeleteModal';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import EmptyState from '@/app/components/shared/EmptyState';
import FormCreateModal from '@/app/components/forms/FormCreateModal';
import FormActionMenu from '@/app/components/forms/FormActionMenu';
import FormStatusBadge from '@/app/components/forms/FormStatusBadge';
import { FormStatus } from '@/core/types';

export default function FormsPage() {
  const router = useRouter();
  const [openDeleteManyDialog, toggleOpenDeleteManyDialog] = useToggle(false);
  const { isLoading, data: forms } = useForms();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAddFormSubmit = useFormAddMutation();
  const handleDeleteForms = useFormDeleteManyMutation(selectedIds);

  const onAddForm = async () => {
    try {
      const newForm = await handleAddFormSubmit.mutateAsync({});
      router.push(`/forms/${newForm._id}/edit`);
    } catch (error) {
      console.log(error);
    }
  };

  async function onDeleteForms() {
    await handleDeleteForms.mutateAsync();
    setSelectedIds([]);
  }

  const data = useMemo(() => formatForms(forms?.data), [forms?.data]);

  const isFormClosed = (row: any) => {
    return (
      row.original.settings?.limitResponses &&
      row.original.responsesCount === row.original?.settings?.maxResponses
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Form name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <Link to={`/forms/${row.original.id}`}>
            <Box className="flex items-center space-x-2 hover:text-indigo-700">
              <Text className="font-semibold">{value}</Text>
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
        Cell: ({ value, row }) => (
          <FormStatusBadge
            status={isFormClosed(row) ? FormStatus.CLOSED : value}
          />
        ),
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value, row }) => (
          <Box className="flex space-x-1">
            <FormActionMenu id={row.original.id} status={row.original.status} />
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
                <Button
                  leftIcon={<IconPlus size={16} />}
                  onClick={onAddForm}
                  loading={handleAddFormSubmit.isLoading}
                >
                  Add form
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
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
                <Paper
                  withBorder
                  className="p-0 border-gray-600 border-opacity-20 shadow-sm"
                >
                  <Box className="py-7">
                    <EmptyState
                      title="There are no forms yet"
                      icon={<IconClipboardText size={50} />}
                      actionButton={
                        <Button
                          leftIcon={<IconPlus size={16} />}
                          onClick={onAddForm}
                        >
                          Add form
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

      {/* <FormCreateModal
        opened={open}
        onClose={toggleOpen}
      /> */}

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
