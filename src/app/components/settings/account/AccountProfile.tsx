import { Box, Paper, SimpleGrid, Text, TextInput, Title } from '@mantine/core';
import { isEmpty } from 'lodash';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useYupResolver } from '@/app/hooks';
import { User } from '@/core/types';
import Button from '@/app/components/shared/Button';

const schema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
});

interface Props {
  user?: User;
  submit?: (data: User) => Promise<void | User>;
}

export default function AccountProfile({ user, submit }: Props) {
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({ resolver });

  const onSubmit = async (data: User) => {
    try {
      const firstName = data.firstName || user?.firstName;
      const lastName = data.lastName || user?.lastName;
      const profileInfo: User = { firstName, lastName };
      await submit(profileInfo);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper padding="lg" withBorder className="border-gray-600 border-opacity-20 shadow-sm">
      <Title order={2}>Profile</Title>
      <Text className="mt-1">Manage your personal profile details.</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="mt-3 space-y-5">
          <Box className="space-y-2">
            <SimpleGrid cols={2}>
              <TextInput
                label="First name"
                defaultValue={user?.firstName}
                {...register('firstName')}
                error={errors?.firstName && errors?.firstName?.message}
              />
              <TextInput
                label="Last name"
                defaultValue={user?.lastName}
                {...register('lastName')}
                error={errors.lastName && errors?.lastName?.message}
              />
            </SimpleGrid>
            <TextInput label="Email" defaultValue={user?.email} disabled />
          </Box>
          <Button type="submit" loading={isSubmitting}>
            Save changes
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
