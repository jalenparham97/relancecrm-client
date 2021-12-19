import React, { useState } from 'react';
import { Box, Checkbox, Divider, Group, Text, ActionIcon, Badge } from '@mantine/core';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { AxiosResponse } from 'axios';
import { Task, TaskResponse } from '@/types';
import { formatDate } from '@/utils';
import { useDialog } from '@/hooks';
import DeleteModal from '@/components/shared/DeleteModal';
import TaskEditModal from './TaskEditModal';

interface Props {
  task: TaskResponse;
  index?: number;
  onUpdate?: ({ id, data }: { id?: string; data?: Task }) => Promise<Task | void>;
  onDelete?: (taskId?: string) => Promise<AxiosResponse<any>>;
  loading?: boolean;
}

export default function TaskItem({ task, index, onUpdate, onDelete, loading = false }: Props) {
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
          {task.dueDate && <Badge variant="dot">{formatDate(task.dueDate, 'MMM, DD')}</Badge>}
          {!task.completed && (
            <ActionIcon title="edit" color="green" onClick={toggleOpenEditModal}>
              <FiEdit />
            </ActionIcon>
          )}
          <ActionIcon title="Delete" color="red" onClick={toggleOpenDeleteModal}>
            <FiTrash2 />
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
