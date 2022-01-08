import { Group, Paper, Box, Text, ActionIcon, Title } from '@mantine/core';
import { FiTrash2 } from 'react-icons/fi';
import { Client, Project } from '@/types';
import { useProjectIdDeleteMutation } from '@/api/projects';
import { useDialog } from '@/hooks';
import Link from '@/components/shared/Link';
import DeleteModal from '@/components/shared/DeleteModal';
import ProjectStatusBadge from './ProjectStatusBadge';

interface Props {
  project: Project;
  client: Client;
}

export default function ProjectItem({ project, client }: Props) {
  const [deleteModal, openDeleteModal, closeDeleteModal] = useDialog();

  const handleProjectDelete = useProjectIdDeleteMutation(client?._id);

  const onDelete = async () => {
    await handleProjectDelete.mutateAsync(project?._id);
  };

  return (
    <Paper withBorder padding="md" className="border-gray-600 border-opacity-30">
      <Group position="apart">
        <Link to={`/projects/${project._id}`}>
          <Box className={project?.description && 'space-y-1'}>
            <Group align="center">
              <Title order={3}>{project?.projectName}</Title>
              <ProjectStatusBadge status={project?.status} />
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
