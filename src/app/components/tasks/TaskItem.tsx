import React, { useState } from 'react';
import { Box, Checkbox, Divider, Group, Text, ActionIcon, Badge } from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons';
import { AxiosResponse } from 'axios';
import { Task, TaskResponse } from '@/core/types';
import { formatDate } from '@/app/utils';
import { useColors, useDialog } from '@/app/hooks';
import DeleteModal from '@/app/components/shared/DeleteModal';
import TaskEditModal from './TaskEditModal';

interface Props {
  task: TaskResponse;
  index?: number;
  onUpdate?: ({ id, data }: { id?: string; data?: Task }) => Promise<Task | void>;
  onDelete?: (taskId?: string) => Promise<AxiosResponse<any>>;
  loading?: boolean;
}

export default function TaskItem({ task, index, onUpdate, onDelete, loading = false }: Props) {
  const colors = useColors();
  const [checked, setChecked] = useState(false);
  const [openEditModal, toggleOpenEditModal, closeEditModal] = useDialog();
  const [openDeleteModal, toggleOpenDeleteModal, closeDeleteModal] = useDialog();

  const handleChange = async (event: React.ChangeEvent<{ checked: boolean }>) => {
    setChecked(event.target.checked);
    if (!task.completed) {
      const update = { completed: true };
      await onUpdate({ id: task._id, data: update });
    } else {
      const update = { completed: false };
      await onUpdate({ id: task._id, data: update });
    }
  };

  const handleDeleteTask = async () => {
    await onDelete(task._id);
    toggleOpenDeleteModal();
  };

  return (
    <Box>
      {index && index !== 0 ? <Divider /> : ''}
      <Group position="apart" align="center">
        <Group className="py-4" align="center">
          <Checkbox checked={task.completed || checked} onChange={handleChange} />
          <Text>{task.content}</Text>
        </Group>
        <Group align="center" spacing="xs">
          {task.project && (
            <Badge sx={{ backgroundColor: task.project.backgroundColor, color: 'white' }}>
              {task.project.projectName}
            </Badge>
          )}
          {task.dueDate && <Badge variant="dot">{formatDate(task.dueDate, 'MMM, DD')}</Badge>}
          {!task.completed && (
            <ActionIcon title="edit" color="green" onClick={toggleOpenEditModal} variant="default">
              <IconEdit size={16} />
            </ActionIcon>
          )}
          <ActionIcon title="Delete" onClick={toggleOpenDeleteModal} variant="default">
            <IconTrash size={16} color={colors.red[6]} />
          </ActionIcon>
        </Group>
      </Group>

      <TaskEditModal
        task={task}
        opened={openEditModal}
        onClose={closeEditModal}
        submit={onUpdate}
      />

      <DeleteModal
        title="Task"
        opened={openDeleteModal}
        onClose={closeDeleteModal}
        isLoading={loading}
        onDelete={handleDeleteTask}
      />
    </Box>
  );
}
