import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { Box, Container, Group, Paper, Title, Text } from '@mantine/core';
import { IconPlus, IconFileDescription } from '@tabler/icons';
import {
  useProposalAddMutation,
  useProposalDeleteManyMutation,
  useProposals,
} from '@/app/api/proposals';
import { formatProposals } from '@/app/utils';
import { isEmpty } from 'lodash';
import { FormStatus, Proposal, ProposalStatus } from '@/core/types';
import { useUser } from '@/app/api/auth';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import DataTable from '@/app/components/shared/DataTable';
import Link from '@/app/components/shared/Link';
import DeleteModal from '@/app/components/shared/DeleteModal';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import EmptyState from '@/app/components/shared/EmptyState';
import ProposalStatusBadge from '@/app/components/proposals/ProposalStatusBadge';
import ProposalActionMenu from '@/app/components/proposals/ProposalActionMenu';
import { DefaultProposal } from '@/app/store';

export default function ProposalsPage() {
  const user = useUser();
  const router = useRouter();
  const [openDeleteManyDialog, toggleOpenDeleteManyDialog] = useToggle(false);
  const { isLoading, data: proposals } = useProposals();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAddProposalSubmit = useProposalAddMutation();
  const handleDeleteProposals = useProposalDeleteManyMutation(selectedIds);

  const onAddProposal = async () => {
    try {
      const newProposal = await handleAddProposalSubmit.mutateAsync({
        fromName: user.fullName,
        fromCompany: user.businessInfo.businessName || '',
        fromAddress: user.businessInfo.address || '',
        ...DefaultProposal,
      });
      router.push(`/proposals/${newProposal._id}/edit`);
      console.log({ newProposal });
    } catch (error) {
      console.log(error);
    }
  };

  async function onDeleteProposals() {
    await handleDeleteProposals.mutateAsync();
    setSelectedIds([]);
  }

  const data = useMemo(
    () => formatProposals(proposals?.data),
    [proposals?.data]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Proposal Title',
        accessor: 'title',
        Cell: ({ value, row }) => (
          <Link
            to={`/proposals/${row.original.id}/${
              row.original.status === ProposalStatus.DRAFT &&
              !row.original.isArchived
                ? 'edit'
                : 'details'
            }`}
          >
            <Box className="flex items-center space-x-2 hover:text-indigo-700">
              <Text className="text-sm font-semibold">{value}</Text>
            </Box>
          </Link>
        ),
      },
      {
        Header: 'Client name',
        accessor: 'clientName',
      },
      {
        Header: 'Project',
        accessor: 'projectName',
      },
      {
        Header: 'Date created',
        accessor: 'createdAt',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value, row }) => (
          <ProposalStatusBadge
            status={row.original.isArchived ? ProposalStatus.ARCHIVED : value}
          />
        ),
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value, row }) => (
          <Box className="flex space-x-1">
            <ProposalActionMenu
              id={row.original.id}
              status={row.original.status}
              proposal={row.original as Proposal}
            />
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
              <Title order={1}>Proposals</Title>
              <Group spacing="xs">
                <Button
                  leftIcon={<IconPlus size={16} />}
                  loading={handleAddProposalSubmit.isLoading}
                  onClick={onAddProposal}
                >
                  Add proposal
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              {!isEmpty(proposals?.data) && (
                <DataTable
                  columns={columns}
                  data={data}
                  setSelectedIds={setSelectedIds}
                  searchPlaceholder="Search proposals"
                  onDeleteClick={toggleOpenDeleteManyDialog}
                />
              )}
              {isEmpty(proposals?.data) && (
                <Paper
                  withBorder
                  className="p-0 border-gray-600 border-opacity-20 shadow-sm"
                >
                  <Box className="py-7">
                    <EmptyState
                      title="There are no proposals yet"
                      icon={<IconFileDescription size={50} />}
                      actionButton={
                        <Button
                          leftIcon={<IconPlus size={16} />}
                          loading={handleAddProposalSubmit.isLoading}
                          onClick={onAddProposal}
                        >
                          Add proposal
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

      <DeleteModal
        opened={openDeleteManyDialog}
        onClose={toggleOpenDeleteManyDialog}
        isLoading={handleDeleteProposals.isLoading}
        onDelete={onDeleteProposals}
        title="Proposal"
      />
    </PageLayout>
  );
}
