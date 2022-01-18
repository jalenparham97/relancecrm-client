import { Modal, Button, Group, ModalProps, Box, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FiCalendar } from 'react-icons/fi';
import * as yup from 'yup';
import { Project, Task } from '@/core/types';
import { useIsDarkMode, useColors, useYupResolver } from '@/app/hooks';
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { useProjects } from '@/app/api/projects';
import ProjectPicker from '@/app/components/projects/ProjectPicker';

const schema = yup.object().shape({
  content: yup.string().trim().required(),
});

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: ({ id, data }: { id?: string; data?: Task }) => Promise<Task | void>;
  task?: Task;
}

export default function TaskEditModal({ task, opened, onClose, submit }: Props) {
  const isDarkMode = useIsDarkMode();
  const colors = useColors();
  const [dueDate, setDueDate] = useState<Date>(task?.dueDate ? new Date(task?.dueDate) : null);
  const [project, setProject] = useState<Project>(task?.project as Project);
  const { data: projects } = useProjects();
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Task>({ resolver });

  const handleFormClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: Task) => {
    try {
      await submit({
        id: task._id,
        data: {
          ...data,
          dueDate: (dueDate && dueDate?.toISOString()) || '',
          project: project?._id || null,
        },
      });
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

  return (
    <Modal opened={opened} onClose={handleFormClose} title="Edit task" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box className="flex flex-col space-y-3">
          <TextInput
            required
            {...register('content')}
            label="Task name"
            defaultValue={task?.content}
            error={errors?.content?.message}
          />

          <DatePicker
            label="Due date"
            zIndex={2000}
            icon={<FiCalendar />}
            defaultValue={task?.dueDate ? new Date(task?.dueDate) : null}
            onChange={handleEndDateChange}
          />

          <ProjectPicker
            label="Project"
            projects={projects?.data}
            setProject={setProject}
            project={task?.project as Project}
          />

          <Box mt={15}>
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
                Update task
              </Button>
            </Group>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
