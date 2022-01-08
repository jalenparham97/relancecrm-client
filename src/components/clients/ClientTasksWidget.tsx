import { Box, Divider, Paper, Title, Group, ActionIcon } from '@mantine/core';
import {
  useTaskIdAddMutation,
  useTaskIdDeleteMutation,
  useTaskIdUpdateMutation,
  useTasksClient,
} from '@/api/tasks';
import { isEmpty } from 'lodash';
import { Task } from '@/types';
import { FiPlus } from 'react-icons/fi';
import { BsListCheck } from 'react-icons/bs';
import { useDialog } from '@/hooks';
import TaskItem from '@/components/tasks/TaskItem';
import LoadingLoader from '@/components/shared/LoadingLoader';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import TaskCreateModal from '../tasks/TaskCreateModal';

interface Props {
  id?: string;
  [x: string]: any;
}

export default function ClientTasksWidget({ id, ...otherProps }: Props) {
  const { isLoading, data: tasks } = useTasksClient(id);
  const [taskCreateModal, openTaskCreateModal, closeTaskCreateModal] = useDialog();

  const filterActiveTasks = ({ completed }: Task) => {
    return completed === false;
  };

  const handleTaskSubmit = useTaskIdAddMutation(id);
  const handleUpdateTask = useTaskIdUpdateMutation(id);
  const handelDeleteTask = useTaskIdDeleteMutation(id);

  const onTaskSubmit = async (data: Task) => {
    return await handleTaskSubmit.mutateAsync({ ...data, clientId: id });
  };

  const activeTasks = tasks?.data.filter(filterActiveTasks);

  return (
    <Paper>
      {isLoading && <LoadingLoader height="100%" />}
      {!isLoading && (
        <Box>
          {!isEmpty(activeTasks) && (
            <Box>
              <Group position="apart" className="mb-2">
                <Title order={2}>Tasks</Title>
                <Button leftIcon={<FiPlus />} onClick={openTaskCreateModal}>
                  Add task
                </Button>
              </Group>
              {activeTasks.map((task, index) => (
                <Box key={task._id}>
                  <TaskItem
                    task={task}
                    index={index}
                    onUpdate={handleUpdateTask.mutateAsync}
                    onDelete={handelDeleteTask.mutateAsync}
                    loading={handelDeleteTask.isLoading}
                  />
                </Box>
              ))}
            </Box>
          )}

          {isEmpty(activeTasks) && (
            <Box className="py-4">
              <EmptyState
                title="This client does not have any active tasks"
                icon={<BsListCheck size="50px" />}
                actionButton={
                  <Button leftIcon={<FiPlus />} onClick={openTaskCreateModal}>
                    Add task
                  </Button>
                }
              />
            </Box>
          )}
        </Box>
      )}

      <TaskCreateModal
        opened={taskCreateModal}
        onClose={closeTaskCreateModal}
        submit={onTaskSubmit}
        hideProjectPicker
      />
    </Paper>
  );
}
