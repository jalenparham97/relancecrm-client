import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useToggle } from 'react-use';
import { IconBolt, IconTrash, IconCheck, IconEdit } from '@tabler/icons';
import { ProjectStatus } from '@/core/types';
import { useProjectDeleteMutation, useProjectUpdateStatusMutation } from '@/app/api/projects';
import DeleteModal from '@/app/components/shared/DeleteModal';

interface Props {
  id: string;
  status?: ProjectStatus;
}

export default function ProjectActionsMenu({ id, status }: Props) {
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);

  const handleDeleteProject = useProjectDeleteMutation();
  const handleUpdateProjectStatus = useProjectUpdateStatusMutation(id);

  const onMarkAsDone = async () => {
    await handleUpdateProjectStatus.mutateAsync({ status: ProjectStatus.DONE });
  };

  const onMarkAsActive = async () => {
    await handleUpdateProjectStatus.mutateAsync({ status: ProjectStatus.ACTIVE });
  };

  const onDeleteProject = async () => {
    await handleDeleteProject.mutateAsync(id);
    toggleOpenDeleteDialog();
  };

  return (
    <>
      <Menu closeOnItemClick={false}>
        <Menu.Item component={NextLink} href={`/projects/${id}`} icon={<IconEdit size={16} />}>
          Edit
        </Menu.Item>
        {status === ProjectStatus.ACTIVE && (
          <Menu.Item
            icon={<IconCheck size={16} />}
            component="button"
            disabled={handleUpdateProjectStatus.isLoading}
            onClick={onMarkAsDone}
          >
            Mark as done
          </Menu.Item>
        )}
        {status === ProjectStatus.DONE && (
          <Menu.Item
            icon={<IconBolt size={16} />}
            disabled={handleUpdateProjectStatus.isLoading}
            component="button"
            onClick={onMarkAsActive}
          >
            Mark as active
          </Menu.Item>
        )}
        <Menu.Item icon={<IconTrash size={16} />} color="red" onClick={toggleOpenDeleteDialog}>
          Delete
        </Menu.Item>
      </Menu>

      <DeleteModal
        title="Project"
        opened={openDeleteDialog}
        onClose={toggleOpenDeleteDialog}
        isLoading={handleDeleteProject.isLoading}
        onDelete={onDeleteProject}
      />
    </>
  );
}
