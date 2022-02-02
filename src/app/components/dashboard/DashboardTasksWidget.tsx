import { Box, Paper, Title, Group } from '@mantine/core';
import {
  useTaskAddMutation,
  useTaskDeleteMutation,
  useTasks,
  useTaskUpdateMutation,
} from '@/app/api/tasks';
import { isEmpty } from 'lodash';
import { Task } from '@/core/types';
import { FiPlus } from 'react-icons/fi';
import { BsListCheck } from 'react-icons/bs';
import { useDialog } from '@/app/hooks';
import TaskItem from '@/app/components/tasks/TaskItem';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';
import EmptyState from '@/app/components/shared/EmptyState';
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
    <Paper padding="lg" withBorder className="border-gray-600 border-opacity-20 shadow-sm">
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
