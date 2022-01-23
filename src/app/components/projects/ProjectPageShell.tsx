import { useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import {
  Box,
  Container,
  Loader,
  Paper,
  Group,
  Title,
  Text,
  Menu,
  Divider,
  Grid,
  Col,
  Tabs as MantineTabs,
} from '@mantine/core';
import { FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiZap } from 'react-icons/fi';
import {
  useProject,
  useProjectDeleteMutation,
  useProjectUpdateMutation,
  useProjectUpdateStatusMutation,
} from '@/app/api/projects';
import { Project, ProjectStatus } from '@/core/types';
import { formatDate } from '@/app/utils';
import { isEmpty } from 'lodash';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import Avatar from '@/app/components/shared/Avatar';
import TabPanel from '@/app/components/shared/TabPanel';
import DeleteModal from '@/app/components/shared/DeleteModal';
import ProjectStatusBadge from '@/app/components/projects/ProjectStatusBadge';
import ProjectEditModal from '@/app/components/projects/ProjectEditModal';
import Tabs from '@/app/components/shared/Tabs';
import NavTab from '../shared/NavTab';
import NavTabs from '../shared/NavTabs';
import Link from '../shared/Link';

interface Props {
  project: Project;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function ProjectPageShell({ project, isLoading, children }: Props) {
  const router = useRouter();
  const query = router.query;
  const [openProjectEditDialog, toggleOpenProjectEditDialog] = useToggle(false);
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleDeleteProject = useProjectDeleteMutation();
  const handleUpdateProjectSubmit = useProjectUpdateMutation(query.id as string);

  const onMarkAsDone = async () => {
    await handleUpdateProjectSubmit.mutateAsync({ status: ProjectStatus.DONE });
  };

  const onMarkAsActive = async () => {
    await handleUpdateProjectSubmit.mutateAsync({ status: ProjectStatus.ACTIVE });
  };

  const onDeleteProject = async () => {
    await handleDeleteProject.mutateAsync(query.id as string);
    if (!handleDeleteProject.isLoading) {
      router.push('/projects');
    }
  };

  return (
    <PageLayout>
      <Container size="xl">
        {isLoading && (
          <Box className="flex justify-center items-center h-[80vh]">
            <Loader />
          </Box>
        )}
        {!isLoading && (
          <Box>
            <Button
              className="hover:bg-transparent"
              variant="subtle"
              color="dark"
              leftIcon={<FiArrowLeft />}
              compact
              to="/projects"
            >
              Back to projects
            </Button>
            <Paper
              padding="xl"
              withBorder
              className="mt-4 border-gray-600 border-opacity-20 shadow-sm"
            >
              <Group position="apart">
                <Group spacing={20}>
                  <Avatar radius="xl" size="lg" backgroundColor={project?.backgroundColor}>
                    {project?.initials}
                  </Avatar>
                  <Title order={2}>{project?.projectName}</Title>
                  <ProjectStatusBadge status={project?.status} />
                </Group>
                <Group>
                  <Menu placement="end" closeOnItemClick={false}>
                    <Menu.Item icon={<FiEdit2 />} onClick={toggleOpenProjectEditDialog}>
                      Edit
                    </Menu.Item>
                    {project?.status === ProjectStatus.ACTIVE && (
                      <Menu.Item
                        component="button"
                        icon={<FiCheck />}
                        disabled={handleUpdateProjectSubmit.isLoading}
                        onClick={onMarkAsDone}
                      >
                        Mark as done
                      </Menu.Item>
                    )}
                    {project?.status === ProjectStatus.DONE && (
                      <Menu.Item
                        component="button"
                        icon={<FiZap />}
                        disabled={handleUpdateProjectSubmit.isLoading}
                        onClick={onMarkAsActive}
                      >
                        Mark as active
                      </Menu.Item>
                    )}
                    <Menu.Item color="red" icon={<FiTrash2 />} onClick={toggleOpenDeleteDialog}>
                      Delete
                    </Menu.Item>
                  </Menu>
                </Group>
              </Group>

              <Box className="mt-5">
                <Text>{project?.description}</Text>
              </Box>

              <Divider className="mt-4" />

              <Box className="mt-4">
                <Grid justify="space-between" align="center">
                  <Col span={6}>
                    {project.endDate && (
                      <Box>
                        <Text className="font-semibold">Project dates:</Text>
                        <Text>
                          {formatDate(project?.createdAt)} - {formatDate(project?.endDate)}
                        </Text>
                      </Box>
                    )}
                  </Col>
                  <Col span={6}>
                    {!isEmpty(project?.client) && (
                      <Group direction="column" position="right" spacing={0}>
                        <Link to={`/clients/${project.client._id}`}>
                          <Avatar backgroundColor={project.client.backgroundColor} radius="xl">
                            {project.client.initials}
                          </Avatar>
                        </Link>
                      </Group>
                    )}
                  </Col>
                </Grid>
              </Box>
            </Paper>

            <Paper mt={20} withBorder className="border-gray-600 border-opacity-20 shadow-sm">
              <NavTabs className="ml-[12px] px-2">
                <NavTab to={`/projects/${query.id}`} label="Tasks" />
                <NavTab to={`/projects/${query.id}/invoices`} label="Invoices" />
              </NavTabs>

              <Box className="p-5">{children}</Box>
            </Paper>
          </Box>
        )}
      </Container>

      <ProjectEditModal
        project={project}
        opened={openProjectEditDialog}
        onClose={toggleOpenProjectEditDialog}
        submit={handleUpdateProjectSubmit.mutateAsync}
      />

      <DeleteModal
        opened={openDeleteDialog}
        onClose={toggleOpenDeleteDialog}
        isLoading={handleDeleteProject.isLoading}
        onDelete={onDeleteProject}
        title="Project"
      />
    </PageLayout>
  );
}
