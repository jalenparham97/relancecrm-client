import { Modal, Button, Group, ModalProps, Box, TextInput, Textarea, Select } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FiCalendar } from 'react-icons/fi';
import { HiOutlineSelector } from 'react-icons/hi';
import * as yup from 'yup';
import { Client, CreateProject, Project } from '@/core/types';
import { useIsDarkMode, useColors, useYupResolver } from '@/app/hooks';
import { useToggle } from 'react-use';
import { useState, useCallback } from 'react';
import { DatePicker } from '@mantine/dates';
import { debounce } from 'lodash';
import { useClients } from '@/app/api/clients';
import ClientPicker from '@/app/components/clients/ClientPicker';

const schema = yup.object().shape({
  projectName: yup.string().trim().required('Project name is a required field'),
  description: yup.string().trim(),
});

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: CreateProject) => Promise<Project>;
  project?: Project;
}

export default function ProjectEditModal({ project, opened, onClose, submit }: Props) {
  const isDarkMode = useIsDarkMode();
  const colors = useColors();
  const [endDate, setEndDate] = useState<Date>(
    project?.endDate ? new Date(project?.endDate) : null
  );
  const [client, setClient] = useState<Client>(project?.client);
  const { data: clients } = useClients();
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProject>({ resolver });

  const handleFormClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: CreateProject) => {
    try {
      await submit({ ...data, endDate: endDate?.toISOString() || '', client: client?._id || null });
      if (!isSubmitting) {
        handleFormClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndDateChange = (dateValue: Date) => {
    setEndDate(dateValue);
  };

  const changeHandler = (query: string) => {
    console.log(query);
  };

  const onSelectChange = useCallback(debounce(changeHandler, 3000), []);

  return (
    <Modal opened={opened} onClose={handleFormClose} title="Create a new project" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box className="flex flex-col space-y-3">
          <TextInput
            required
            {...register('projectName')}
            label="Project name"
            defaultValue={project?.projectName}
            error={errors?.projectName?.message}
          />
          <Textarea
            {...register('description')}
            label="Project description"
            defaultValue={project?.description}
            error={errors?.description?.message}
          />

          <Box>
            <DatePicker
              label="Project end date"
              zIndex={2000}
              icon={<FiCalendar />}
              defaultValue={project?.endDate ? new Date(project?.endDate) : null}
              onChange={handleEndDateChange}
            />
          </Box>

          <ClientPicker
            label="Client"
            clients={clients?.data}
            setClient={setClient}
            client={project?.client}
          />

          <Box mt={20}>
            <Group spacing="sm" position="right">
              <Button variant="default" onClick={handleFormClose}>
                Cancel
              </Button>
              <Button loading={isSubmitting} type="submit">
                Update project
              </Button>
            </Group>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
