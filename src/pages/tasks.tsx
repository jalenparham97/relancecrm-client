import { useCallback, useState } from 'react';
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
import {
  useTasks,
  useTaskAddMutation,
  useTaskDeleteMutation,
  useTaskUpdateMutation,
} from '@/api/tasks';
import { FiPlus } from 'react-icons/fi';
import { formatDate } from '@/utils';
import { debounce, isEmpty } from 'lodash';
import PageLayout from '@/components/layouts/PageLayout';
import Button from '@/components/shared/Button';
import TabPanel from '@/components/shared/TabPanel';
import DeleteModal from '@/components/shared/DeleteModal';
import Search from '@/components/shared/Search';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import { useToggle } from 'react-use';
import TaskItem from '@/components/tasks/TaskItem';
import { useDialog } from '@/hooks/useDialog';
import Tabs from '@/components/shared/Tabs';

export default function TasksPage() {
  const [openTaskCreateModal, toggleTaskCreateModal, closeTaskCreateDialog] = useDialog();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { isLoading, data: tasks } = useTasks();

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
      {isLoading && (
        <Box className="flex justify-center items-center h-[80vh]">
          <Loader />
        </Box>
      )}
      {!isLoading && (
        <Container size="xl">
          <Box>
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

            <Paper className="mt-4" shadow="sm">
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
                  {!isEmpty(tasks?.data.filter(filterCompletedTasks)) &&
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
                    ))}
                </TabPanel>
              </Box>
            </Paper>
          </Box>
        </Container>
      )}

      <TaskCreateModal
        opened={openTaskCreateModal}
        onClose={closeTaskCreateDialog}
        submit={handleTaskSubmit.mutateAsync}
      />
    </PageLayout>
  );
}
