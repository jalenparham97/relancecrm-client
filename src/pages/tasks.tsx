import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Group,
  Title,
  Tabs as MantineTabs,
} from '@mantine/core';
import {
  useTasks,
  useTaskAddMutation,
  useTaskDeleteMutation,
  useTaskUpdateMutation,
} from '@/app/api/tasks';
import { IconPlus, IconListCheck, IconSquareCheck } from '@tabler/icons';
import { isEmpty } from 'lodash';
import { useDialog } from '@/app/hooks';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import TabPanel from '@/app/components/shared/TabPanel';
import Search from '@/app/components/shared/Search';
import TaskCreateModal from '@/app/components/tasks/TaskCreateModal';
import TaskItem from '@/app/components/tasks/TaskItem';
import Tabs from '@/app/components/shared/Tabs';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import EmptyState from '@/app/components/shared/EmptyState';

export default function TasksPage() {
  const [openTaskCreateModal, toggleTaskCreateModal, closeTaskCreateDialog] =
    useDialog();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { isLoading, data: tasks } = useTasks();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filterActiveTasks = ({ completed, content }) => {
    return (
      completed === false &&
      content.toLowerCase().match(searchInput.toLowerCase())
    );
  };

  const filterCompletedTasks = ({ completed, content }) => {
    return (
      completed === true &&
      content.toLowerCase().match(searchInput.toLowerCase())
    );
  };

  const handleTaskSubmit = useTaskAddMutation();
  const handleUpdateTask = useTaskUpdateMutation();
  const handelDeleteTask = useTaskDeleteMutation();

  return (
    <PageLayout>
      <Box>
        {isLoading && <LoadingLoader height="90vh" />}
        {!isLoading && (
          <Container size="xl">
            <Box className="flex justify-between items-center">
              <Title order={1}>Tasks</Title>
              <Group spacing="xs">
                <Search
                  placeholder="Search tasks"
                  searchValue={searchInput}
                  onSearchChange={handleSearchChange}
                />
                <Button
                  leftIcon={<IconPlus size={16} />}
                  onClick={toggleTaskCreateModal}
                >
                  Add Task
                </Button>
              </Group>
            </Box>

            <Box className="mt-8">
              <Tabs active={activeTab} onTabChange={setActiveTab}>
                <MantineTabs.Tab label="Active" />
                <MantineTabs.Tab label="Completed" />
              </Tabs>

              <Box>
                <TabPanel index={0} activeIndex={activeTab}>
                  {!isEmpty(tasks?.data?.filter(filterActiveTasks)) &&
                    tasks?.data
                      ?.filter(filterActiveTasks)
                      .map((task, index) => (
                        <Box key={task?._id}>
                          <TaskItem
                            task={task}
                            index={index}
                            onUpdate={handleUpdateTask.mutateAsync}
                            onDelete={handelDeleteTask.mutateAsync}
                            loading={handelDeleteTask.isLoading}
                          />
                        </Box>
                      ))}
                  {isEmpty(tasks?.data?.filter(filterActiveTasks)) && (
                    <Box className="py-4">
                      <EmptyState
                        title="There are no active tasks yet"
                        icon={<IconListCheck size="50px" />}
                        actionButton={
                          <Button
                            leftIcon={<IconPlus size={16} />}
                            onClick={toggleTaskCreateModal}
                          >
                            Add Task
                          </Button>
                        }
                      />
                    </Box>
                  )}
                </TabPanel>
                <TabPanel index={1} activeIndex={activeTab}>
                  {!isEmpty(tasks?.data.filter(filterCompletedTasks)) &&
                    tasks?.data
                      .filter(filterCompletedTasks)
                      .map((task, index) => (
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
                  {isEmpty(tasks?.data.filter(filterCompletedTasks)) && (
                    <Box className="py-4">
                      <EmptyState
                        title="There are no completed tasks yet"
                        icon={<IconSquareCheck size="50px" />}
                      />
                    </Box>
                  )}
                </TabPanel>
              </Box>
            </Box>
          </Container>
        )}

        <TaskCreateModal
          opened={openTaskCreateModal}
          onClose={closeTaskCreateDialog}
          submit={handleTaskSubmit.mutateAsync}
        />
      </Box>
    </PageLayout>
  );
}
