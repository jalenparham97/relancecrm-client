import { useState } from 'react';
import { isEmpty } from 'lodash';
import { Box, Paper, Title, Group } from '@mantine/core';
import { FiBriefcase, FiPlus } from 'react-icons/fi';
import { useProjectsClient, useProjectIdAddMutation } from '@/app/api/projects';
import { Client, CreateProject } from '@/core/types';
import { useDialog } from '@/app/hooks';
import EmptyState from '@/app/components/shared/EmptyState';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';
import ProjectCreateModal from '../projects/ProjectCreateModal';
import ProjectItem from '../projects/ProjectItem';

interface Props {
  id?: string;
  client?: Client;
  [x: string]: any;
}

export default function ClientProjectsWidget({ id, client }: Props) {
  const [error, setError] = useState(null);
  const [projectModal, openProjectModal, closeProjectModal] = useDialog();
  const { isLoading, data: projects } = useProjectsClient(id);

  const handleProjectCreate = useProjectIdAddMutation(id);

  const onProjectSubmit = async (data: CreateProject) => {
    return await handleProjectCreate.mutateAsync({ ...data, client: id });
  };

  return (
    <Paper>
      {isLoading && <LoadingLoader height="100%" />}
      {!isLoading && (
        <Box>
          {!isEmpty(projects?.data) && (
            <Box>
              <Group position="apart">
                <Title order={2}>Projects</Title>
                <Button leftIcon={<FiPlus />} onClick={openProjectModal}>
                  Add project
                </Button>
              </Group>
              <Box className="mt-4 space-y-3">
                {projects?.data.map((project) => (
                  <Box key={project._id}>
                    <ProjectItem project={project} client={client} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {isEmpty(projects?.data) && (
            <Box className="py-4">
              <EmptyState
                title="This client does not have any projects"
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
        hideClientPicker
        opened={projectModal}
        onClose={closeProjectModal}
        submit={onProjectSubmit}
      />
    </Paper>
  );
}
