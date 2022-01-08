import { Box, Paper, Title, Group } from '@mantine/core';
import { useProjectAddMutation, useProjects } from '@/api/projects';
import { isEmpty } from 'lodash';
import { CreateProject } from '@/types';
import { FiBriefcase, FiPlus } from 'react-icons/fi';
import { useDialog } from '@/hooks';
import LoadingLoader from '@/components/shared/LoadingLoader';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import ProjectCreateModal from '../projects/ProjectCreateModal';
import DashboardProjectItem from './DashboardProjectItem';

export default function DashboardProjectsWidget() {
  const { isLoading, data: projects } = useProjects();
  const [projectModal, openProjectModal, closeProjectModal] = useDialog();

  const handlePRojectSubmit = useProjectAddMutation();

  const onProjectSubmit = async (data: CreateProject) => {
    return await handlePRojectSubmit.mutateAsync(data);
  };

  const recentProjects = projects?.data.slice(0, 4);

  return (
    <Paper padding="lg" shadow="xs" withBorder>
      {isLoading && <LoadingLoader height="100%" />}
      {!isLoading && (
        <Box>
          {!isEmpty(recentProjects) && (
            <Box className="space-y-3">
              <Group position="apart">
                <Title order={2}>Recent projects</Title>
                <Button variant="default" leftIcon={<FiPlus />} onClick={openProjectModal}>
                  Add project
                </Button>
              </Group>
              <Box className="space-y-3">
                {recentProjects.map((project, index) => (
                  <Box key={project._id}>
                    <DashboardProjectItem project={project} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {isEmpty(recentProjects) && (
            <Box className="py-4">
              <EmptyState
                title="You do not have any projects"
                icon={<FiBriefcase size="50px" />}
                actionButton={
                  <Button leftIcon={<FiPlus />} onClick={openProjectModal}>
                    Add project
                  </Button>
                }
              />
            </Box>
          )}
        </Box>
      )}

      <ProjectCreateModal
        opened={projectModal}
        onClose={closeProjectModal}
        submit={onProjectSubmit}
      />
    </Paper>
  );
}
