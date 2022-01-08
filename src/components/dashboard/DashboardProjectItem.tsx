import { Group, Paper, Box, Text, ActionIcon, Title } from '@mantine/core';
import { FiTrash2 } from 'react-icons/fi';
import { Client, Project } from '@/types';
import { useProjectDeleteMutation, useProjectIdDeleteMutation } from '@/api/projects';
import { useDialog } from '@/hooks';
import Link from '@/components/shared/Link';
import DeleteModal from '@/components/shared/DeleteModal';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';

interface Props {
  project: Project;
}

export default function DashboardProjectItem({ project }: Props) {
  const [deleteModal, openDeleteModal, closeDeleteModal] = useDialog();

  const handleProjectDelete = useProjectDeleteMutation();

  const onDelete = async () => {
    await handleProjectDelete.mutateAsync(project?._id);
  };

  return (
    <Paper withBorder padding="sm" className="border-gray-600 border-opacity-30">
      <Group position="apart">
        <Link to={`/projects/${project._id}`}>
          <Box>
            <Group align="center">
              <Title order={4}>{project?.projectName}</Title>
            </Group>
            <Group>
              <Text>{project?.description}</Text>
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
        isLoading={handleProjectDelete.isLoading}
        onDelete={onDelete}
        title="Project"
      />
    </Paper>
  );
}
