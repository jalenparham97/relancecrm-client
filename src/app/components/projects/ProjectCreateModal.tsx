import { Modal, Button, Group, ModalProps, Box, TextInput, Textarea } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FiCalendar } from 'react-icons/fi';
import * as yup from 'yup';
import { Client, CreateProject, Project } from '@/core/types';
import { useYupResolver } from '@/app/hooks';
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
  hideClientPicker?: boolean;
  submit?: (data: CreateProject) => Promise<Project>;
}

export default function ProjectCreateModal({
  opened,
  onClose,
  submit,
  hideClientPicker = false,
}: Props) {
  const [endDate, setEndDate] = useState<Date>(null);
  const [client, setClient] = useState<Client>();
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
    setEndDate(null);
    reset();
  };

  const handleFormSubmit = async (data: CreateProject) => {
    try {
      if (hideClientPicker) {
        await submit({ ...data, endDate: endDate?.toISOString() });
      } else {
        await submit({ ...data, endDate: endDate?.toISOString(), client: client?._id });
      }
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
            error={errors?.projectName?.message}
          />
          <Textarea
            {...register('description')}
            label="Project description"
            error={errors?.description?.message}
          />

          <Box>
            <DatePicker
              label="Project end date"
              clearable
              zIndex={2000}
              icon={<FiCalendar />}
              value={endDate}
              onChange={handleEndDateChange}
            />
          </Box>

          {!hideClientPicker && <ClientPicker clients={clients?.data} setClient={setClient} />}

          <Box mt={20}>
            <Group spacing="sm" position="right">
              <Button variant="default" onClick={handleFormClose}>
                Cancel
              </Button>
              <Button loading={isSubmitting} type="submit">
                Create project
              </Button>
            </Group>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
