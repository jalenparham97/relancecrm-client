import {
  useTaskIdAddMutation,
  useTaskIdDeleteMutation,
  useTaskIdUpdateMutation,
  useTasksProject,
} from '@/app/api/tasks';
import { Task } from '@/core/types';
import { Box, Title, Group } from '@mantine/core';
import { isEmpty } from 'lodash';
import { FiPlus } from 'react-icons/fi';
import { BsListCheck } from 'react-icons/bs';
import { useDialog } from '@/app/hooks';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import TaskItem from '@/app/components/tasks/TaskItem';
import Button from '../shared/Button';
import TaskCreateModal from '../tasks/TaskCreateModal';
import EmptyState from '../shared/EmptyState';

interface Props {
  id?: string;
  [x: string]: any;
}

export default function ProjectTasksWidget({ id, ...otherProps }: Props) {
  const { isLoading, data: tasks } = useTasksProject(id);
  const [taskCreateModal, openTaskCreateModal, closeTaskCreateModal] =
    useDialog();

  const filterActiveTasks = ({ completed }: Task) => {
    return completed === false;
  };

  const handleTaskSubmit = useTaskIdAddMutation(id);
  const handleUpdateTask = useTaskIdUpdateMutation(id);
  const handelDeleteTask = useTaskIdDeleteMutation(id);

  const onTaskSubmit = async (data: Task) => {
    console.log({ data });
    return await handleTaskSubmit.mutateAsync({ ...data, project: id });
  };

  const activeTasks = tasks?.data.filter(filterActiveTasks);

  return (
    <Box>
      {isLoading && <LoadingLoader height="100%" />}
      {!isLoading && (
        <Box>
          {!isEmpty(activeTasks) && (
            <Box>
              <Group position="apart" className="mb-2">
                <Title order={3}>Tasks</Title>
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
                title="This project does not have any active tasks"
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
    </Box>
  );
}
