import { Box, Paper, Title, Text } from '@mantine/core';
import { Project } from '@/core/types';
import { formatDate } from '@/core/utils';
import Link from '../shared/Link';
import { isEmpty } from 'lodash';
import ProjectEditModal from './ProjectEditModal';
import { useProjectUpdateMutation } from '@/app/api/projects';
import { useDialog } from '@/app/hooks';

interface Props {
  project: Project;
}

export default function ProjectOverviewWidget({ project }: Props) {
  const [editModal, openEditModal, closeEditModal] = useDialog();
  const handleUpdateProjectSubmit = useProjectUpdateMutation(project?._id);

  return (
    <Paper withBorder className="border-gray-600 border-opacity-30 shadow-sm">
      <Box className="px-4 py-5 sm:px-6">
        <Title order={3} className="">
          Project Information
        </Title>
      </Box>
      <Box className="border-t border-gray-300 px-4 py-5 sm:px-6">
        <Box className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <Box className="sm:col-span-1">
            <Text sx={{ fontWeight: 600 }}>Client</Text>
            {!isEmpty(project?.client) && (
              <Text className="mt-1 text-indigo-500">
                <Link to={`/clients/${project?.client?._id}`}>
                  {project?.client?.fullName}
                </Link>
              </Text>
            )}
            {isEmpty(project?.client) && (
              <Text className="mt-1 text-indigo-500" onClick={openEditModal}>
                <Link>Add client</Link>
              </Text>
            )}
          </Box>
          <Box className="sm:col-span-1">
            <Text sx={{ fontWeight: 600 }}>Project dates</Text>
            {project.endDate && (
              <Text className="mt-1">
                {formatDate(project?.createdAt)} -{' '}
                {formatDate(project?.endDate)}
              </Text>
            )}
            {!project.endDate && (
              <Text className="mt-1 text-indigo-500" onClick={openEditModal}>
                <Link>Add end date</Link>
              </Text>
            )}
          </Box>
          <Box className="sm:col-span-2">
            <Text sx={{ fontWeight: 600 }}>Description</Text>
            <Text className="mt-1">{project?.description}</Text>
            {!project.description && (
              <Text className="mt-1 text-indigo-500" onClick={openEditModal}>
                <Link>Add description</Link>
              </Text>
            )}
          </Box>
        </Box>
      </Box>

      <ProjectEditModal
        project={project}
        opened={editModal}
        onClose={closeEditModal}
        submit={handleUpdateProjectSubmit.mutateAsync}
      />
    </Paper>
  );
}
