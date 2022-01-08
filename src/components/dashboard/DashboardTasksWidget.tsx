import { Box, Paper, Title, Group } from '@mantine/core';
import {
  useTaskAddMutation,
  useTaskDeleteMutation,
  useTasks,
  useTaskUpdateMutation,
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

export default function DashboardTasksWidget() {
  const { isLoading, data: tasks } = useTasks();
  const [taskCreateModal, openTaskCreateModal, closeTaskCreateModal] = useDialog();

  const filterActiveTasks = ({ completed }: Task) => {
    return completed === false;
  };

  const handleTaskSubmit = useTaskAddMutation();
  const handleUpdateTask = useTaskUpdateMutation();
  const handelDeleteTask = useTaskDeleteMutation();

  const onTaskSubmit = async (data: Task) => {
    return await handleTaskSubmit.mutateAsync({ ...data });
  };

  const activeTasks = tasks?.data.filter(filterActiveTasks).slice(0, 5);

  return (
    <Paper padding="lg" shadow="xs" withBorder>
      {isLoading && <LoadingLoader height="100%" />}
      {!isLoading && (
        <Box>
          {!isEmpty(activeTasks) && (
            <Box>
              <Group position="apart">
                <Title order={2}>Recent tasks</Title>
                <Button variant="default" leftIcon={<FiPlus />} onClick={openTaskCreateModal}>
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
                title="You do not have any active tasks"
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
      />
    </Paper>
  );
}
