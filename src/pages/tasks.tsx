import { useCallback, useState } from 'react';
import { Box, Container, Paper, Group, Title, Tabs as MantineTabs, Text } from '@mantine/core';
import {
  useTasks,
  useTaskAddMutation,
  useTaskDeleteMutation,
  useTaskUpdateMutation,
} from '@/api/tasks';
import { FiPlus } from 'react-icons/fi';
import { debounce, isEmpty } from 'lodash';
import { useIntersectionObserver, useDialog } from '@/hooks';
import PageLayout from '@/components/layouts/PageLayout';
import Button from '@/components/shared/Button';
import TabPanel from '@/components/shared/TabPanel';
import Search from '@/components/shared/Search';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import TaskItem from '@/components/tasks/TaskItem';
import Tabs from '@/components/shared/Tabs';
import LoadingLoader from '@/components/shared/LoadingLoader';

export default function TasksPage() {
  const [openTaskCreateModal, toggleTaskCreateModal, closeTaskCreateDialog] = useDialog();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { isLoading, data: tasks, fetchNextPage, hasMore, isFetching, isPreviousData } = useTasks();

  console.log({ isPreviousData });

  const [moreRef] = useIntersectionObserver({
    threshold: 1,
    onIntersect: fetchNextPage,
    enabled: hasMore,
  });

  const handleSearchChange = (e: React.ChangeEvent<{ value: string }>) => {
    setSearchInput(e.target.value);
  };

  const filterActiveTasks = ({ completed, content }) => {
    return completed === false && content.toLowerCase().match(searchInput.toLowerCase());
  };

  const filterCompletedTasks = ({ completed, content }) => {
    return completed === true && content.toLowerCase().match(searchInput.toLowerCase());
  };

  const changeHandler = (query: string) => {
    console.log(query);
  };

  const onChange = useCallback(debounce(handleSearchChange, 3000), []);

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
                <Button leftIcon={<FiPlus fontSize="16px" />} onClick={toggleTaskCreateModal}>
                  Add Task
                </Button>
              </Group>
            </Box>

            <Paper className="mt-4" shadow="sm" withBorder>
              <Tabs
                active={activeTab}
                onTabChange={setActiveTab}
                styles={{ root: { marginLeft: '20px' } }}
              >
                <MantineTabs.Tab label="Active" />
                <MantineTabs.Tab label="Completed" />
              </Tabs>

              <Box sx={{ padding: '10px 20px' }}>
                <TabPanel index={0} activeIndex={activeTab}>
                  {!isEmpty(tasks?.data?.filter(filterActiveTasks)) &&
                    tasks?.data?.filter(filterActiveTasks).map((task, index) => (
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
                </TabPanel>
                <TabPanel index={1} activeIndex={activeTab}>
                  {/* {!isEmpty(tasks?.data.filter(filterCompletedTasks)) &&
                    tasks?.data.filter(filterCompletedTasks).map((task, index) => (
                      <Box key={task._id}>
                        <TaskItem
                          task={task}
                          index={index}
                          onUpdate={handleUpdateTask.mutateAsync}
                          onDelete={handelDeleteTask.mutateAsync}
                          loading={handelDeleteTask.isLoading}
                        />
                      </Box>
                    ))} */}
                </TabPanel>
              </Box>
            </Paper>
            <div ref={moreRef} className="pb-6 pt-6">
              {isFetching && (
                <Box>
                  <LoadingLoader height="100%" />
                </Box>
              )}
            </div>
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
