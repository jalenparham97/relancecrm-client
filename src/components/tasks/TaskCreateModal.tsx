import { Modal, Button, Group, ModalProps, Box, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FiCalendar } from 'react-icons/fi';
import * as yup from 'yup';
import { useProjects } from '@/api/projects';
import { Task, Project } from '@/types';
import { useIsDarkMode, useColors, useYupResolver } from '@/hooks';
import { useState, useCallback } from 'react';
import { DatePicker } from '@mantine/dates';
import { debounce } from 'lodash';
import ProjectPicker from '@/components/projects/ProjectPicker';

const schema = yup.object().shape({
  content: yup.string().trim().required('Task name is a required field'),
});

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: Task) => Promise<Task>;
  hideProjectPicker?: boolean;
}

export default function TaskCreateModal({
  opened,
  onClose,
  submit,
  hideProjectPicker = false,
}: Props) {
  const isDarkMode = useIsDarkMode();
  const colors = useColors();
  const [dueDate, setDueDate] = useState<Date>(null);
  const [project, setProject] = useState<Project>({});
  const { data: projects } = useProjects();
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Task>({ resolver });

  const handleFormClose = () => {
    onClose();
    setDueDate(null);
    reset();
  };

  const handleFormSubmit = async (data: Task) => {
    try {
      if (hideProjectPicker) {
        await submit({ ...data, dueDate: dueDate?.toISOString() });
      } else {
        await submit({ ...data, dueDate: dueDate?.toISOString(), project: project?._id || null });
      }
      if (!isSubmitting) {
        handleFormClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndDateChange = (dateValue: Date) => {
    setDueDate(dateValue);
  };

  const changeHandler = (query: string) => {
    console.log(query);
  };

  const onSelectChange = useCallback(debounce(changeHandler, 3000), []);

  return (
    <Modal opened={opened} onClose={handleFormClose} title="Create a new task" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box className="flex flex-col space-y-3">
          <TextInput
            required
            {...register('content')}
            label="Task name"
            error={errors?.content?.message}
          />

          <DatePicker
            label="Due date"
            clearable
            zIndex={2000}
            icon={<FiCalendar />}
            value={dueDate}
            onChange={handleEndDateChange}
          />

          {!hideProjectPicker && (
            <ProjectPicker projects={projects?.data} setProject={setProject} />
          )}

          <Box mt={20}>
            <Group spacing="sm" position="right">
              <Button
                color={isDarkMode ? 'gray' : 'dark'}
                variant={isDarkMode ? 'filled' : 'outline'}
                onClick={handleFormClose}
                sx={{ borderColor: !isDarkMode ? colors.gray[4] : '' }}
              >
                Cancel
              </Button>
              <Button loading={isSubmitting} type="submit">
                Create task
              </Button>
            </Group>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
