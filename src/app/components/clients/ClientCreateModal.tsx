import { Modal, Button, Group, ModalProps, Box, TextInput, SimpleGrid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useUser } from '@/app/api/auth';
import * as yup from 'yup';
import { useYupResolver } from '@/app/hooks/useYupResolver';
import { Client } from '@/core/types';
import { useIsDarkMode, useColors } from '@/app/hooks';
import { useToggle } from 'react-use';

const schema = yup.object().shape({
  firstName: yup.string().trim().required('First name is a required field'),
  lastName: yup.string().trim().required('Last name is a required field'),
  email: yup
    .string()
    .trim()
    .required('Email is a required field')
    .email('Please enter a valid email.'),
  phone: yup.string().trim(),
  company: yup.string().trim(),
  website: yup.string().trim(),
  address: yup.string().trim(),
});

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: Client) => Promise<Client>;
}

export default function ClientCreateModal({ opened, onClose, submit }: Props) {
  const [showMore, toggleShowMore] = useToggle(false);
  const isDarkMode = useIsDarkMode();
  const colors = useColors();
  const user = useUser();
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Client>({ resolver });

  const handleFormClose = () => {
    onClose();
    toggleShowMore(false);
    reset();
  };

  const handleFormSubmit = async (data: Client) => {
    try {
      await submit({ ...data });
      handleFormClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal opened={opened} onClose={handleFormClose} title="Create a new client" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Group direction="column" grow spacing="sm">
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }]}>
            <TextInput
              required
              {...register('firstName')}
              label="First name"
              error={errors?.firstName?.message}
            />
            <TextInput
              required
              {...register('lastName')}
              label="Last name"
              error={errors?.lastName?.message}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }]}>
            <TextInput
              required
              {...register('email')}
              label="Email address"
              error={errors?.email?.message}
            />
            <TextInput {...register('phone')} label="Phone number" error={errors?.phone?.message} />
          </SimpleGrid>
          <TextInput {...register('company')} label="Company" error={errors?.company?.message} />
          <TextInput {...register('website')} label="Website" error={errors?.website?.message} />
          <TextInput {...register('address')} label="Address" error={errors?.address?.message} />

          <Box mt={10}>
            <Group spacing="sm" position="right">
              <Button variant="default" onClick={handleFormClose}>
                Cancel
              </Button>
              <Button loading={isSubmitting} type="submit">
                Create client
              </Button>
            </Group>
          </Box>
        </Group>
      </form>
    </Modal>
  );
}
