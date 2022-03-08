import {
  useProjectAddMutation,
  useProjectDeleteManyMutation,
  useProjects,
} from '@/app/api/projects';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import DataTable from '@/app/components/shared/DataTable';
import { Box, Container, Group, Loader, Paper, Title, Text, ActionIcon } from '@mantine/core';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { FiPlus, FiEye, FiBriefcase } from 'react-icons/fi';
import { useToggle } from 'react-use';
import { formatProjects } from '@/app/utils';
import Avatar from '@/app/components/shared/Avatar';
import Link from '@/app/components/shared/Link';
import DeleteModal from '@/app/components/shared/DeleteModal';
import ProjectCreateModal from '@/app/components/projects/ProjectCreateModal';
import ProjectActionsMenu from '@/app/components/projects/ProjectActionsMenu';
import ProjectStatusBadge from '@/app/components/projects/ProjectStatusBadge';
import EmptyState from '@/app/components/shared/EmptyState';

export default function ProjectsPage() {
  const [openDeleteManyDialog, toggleOpenDeleteManyDialog] = useToggle(false);
  const [open, toggleOpen] = useToggle(false);
  const { isLoading, data: projects } = useProjects();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleProjectSubmit = useProjectAddMutation();
  const handleDeleteProjects = useProjectDeleteManyMutation(selectedIds);

  const onDeleteProjects = async () => {
    await handleDeleteProjects.mutateAsync();
    setSelectedIds([]);
  };

  const data = useMemo(() => formatProjects(projects?.data), [projects?.data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Project name',
        accessor: 'projectName',
        Cell: ({ value, row }) => (
          <Link to={`/projects/${row.original.id}`}>
            <Box className="flex items-center space-x-2 hover:text-indigo-700">
              <Avatar radius="xl" backgroundColor={row.original?.backgroundColor}>
                {row.original.initials}
              </Avatar>
              <Text className="font-semibold">{value}</Text>
            </Box>
          </Link>
        ),
      },
      {
        Header: 'End date',
        accessor: 'endDate',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <ProjectStatusBadge status={value} />,
      },
      {
        Header: 'Date created',
        accessor: 'createdAt',
      },
      {
        Header: 'Actions',
        accessor: 'updatedAt',
        Cell: ({ row }) => (
          <Box className="flex items-center space-x-1">
            <Link to={`/projects/${row.original.id}`}>
              <ActionIcon title="View">
                <FiEye />
              </ActionIcon>
            </Link>
            <ProjectActionsMenu id={row.original.id} status={row.original.status} />
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <PageLayout>
      {isLoading && (
        <Box className="flex justify-center items-center h-[80vh]">
          <Loader />
        </Box>
      )}

      {!isLoading && (
        <Container size="xl">
          <Box>
            <Box className="flex justify-between items-center">
              <Title order={1}>Projects</Title>
              <Group spacing="xs">
                <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                  Add project
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              {!isEmpty(projects?.data) && (
                <DataTable
                  columns={columns}
                  data={data}
                  setSelectedIds={setSelectedIds}
                  searchPlaceholder="Search projects"
                  onDeleteClick={toggleOpenDeleteManyDialog}
                />
              )}
              {isEmpty(projects?.data) && (
                <Paper withBorder className="p-0 border-gray-600 border-opacity-20 shadow-sm">
                  <Box className="py-7">
                    <EmptyState
                      title="There are no projects yet"
                      icon={<FiBriefcase size="50px" />}
                      actionButton={
                        <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleOpen}>
                          Add project
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

      <ProjectCreateModal
        opened={open}
        onClose={toggleOpen}
        submit={handleProjectSubmit.mutateAsync}
      />

      <DeleteModal
        opened={openDeleteManyDialog}
        onClose={toggleOpenDeleteManyDialog}
        isLoading={handleDeleteProjects.isLoading}
        onDelete={onDeleteProjects}
        title="Project"
      />
    </PageLayout>
  );
}
