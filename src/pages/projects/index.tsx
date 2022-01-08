import { useProjectAddMutation, useProjectDeleteManyMutation, useProjects } from '@/api/projects';
import PageLayout from '@/components/layouts/PageLayout';
import Button from '@/components/shared/Button';
import DataTable from '@/components/shared/DataTable';
import { Box, Container, Group, Loader, Paper, Title, Text, ActionIcon } from '@mantine/core';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { FiPlus, FiEye, FiBriefcase } from 'react-icons/fi';
import { useToggle } from 'react-use';
import { formatProjects } from '@/utils';
import Avatar from '@/components/shared/Avatar';
import Link from '@/components/shared/Link';
import DeleteModal from '@/components/shared/DeleteModal';
import ProjectCreateModal from '@/components/projects/ProjectCreateModal';
import ProjectActionsMenu from '@/components/projects/ProjectActionsMenu';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import EmptyState from '@/components/shared/EmptyState';

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
                  Add Project
                </Button>
              </Group>
            </Box>

            <Box className="mt-4">
              <Paper shadow="sm" withBorder>
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
                )}
              </Paper>
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
