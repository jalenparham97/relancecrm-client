import { Modal, Button, Group, ModalProps, Box, TextInput, SimpleGrid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useYupResolver } from '@/app/hooks/useYupResolver';
import { Client } from '@/core/types';
import { useIsDarkMode, useColors } from '@/app/hooks';

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
  client?: Client;
}

export default function ClientEditModal({ client, opened, onClose, submit }: Props) {
  const isDarkMode = useIsDarkMode();
  const colors = useColors();
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Client>({ resolver });

  const handleFormSubmit = async (data: Client) => {
    try {
      await submit({ ...data });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit client" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Group direction="column" grow spacing="sm">
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }]}>
            <TextInput
              required
              {...register('firstName')}
              label="First name"
              defaultValue={client?.firstName}
              error={errors?.firstName?.message}
            />
            <TextInput
              required
              {...register('lastName')}
              label="Last name"
              defaultValue={client?.lastName}
              error={errors?.lastName?.message}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }]}>
            <TextInput
              required
              {...register('email')}
              label="Email address"
              defaultValue={client?.email}
              error={errors?.email?.message}
            />
            <TextInput
              {...register('phone')}
              label="Phone number"
              defaultValue={client?.phone}
              error={errors?.phone?.message}
            />
          </SimpleGrid>
          <TextInput
            {...register('company')}
            label="Company"
            defaultValue={client?.company}
            error={errors?.company?.message}
          />
          <TextInput
            {...register('website')}
            label="Website"
            defaultValue={client?.website}
            error={errors?.website?.message}
          />
          <TextInput
            {...register('address')}
            label="Address"
            defaultValue={client?.address}
            error={errors?.address?.message}
          />

          <Box mt={10}>
            <Group spacing="sm" position="right">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button loading={isSubmitting} type="submit">
                Save changes
              </Button>
            </Group>
          </Box>
        </Group>
      </form>
    </Modal>
  );
}
