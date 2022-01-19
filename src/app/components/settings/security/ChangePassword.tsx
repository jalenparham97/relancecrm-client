import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Alert, Box, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { useFirebaseUser } from '@/app/api/auth';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from '@/app/libs/firebase';
import { useToasts, useYupResolver } from '@/app/hooks';
import Button from '@/app/components/shared/Button';
import { BiErrorCircle } from 'react-icons/bi';

const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required.'),
  newPassword: yup.string().required('New password is required.'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match.'),
});

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecurityChangePassword() {
  const firebaseUser = useFirebaseUser();
  const toasts = useToasts();
  const [error, setError] = useState(null);
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver });

  const updateUserPassword = async (data: FormData) => {
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, data.currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, data.newPassword);
      toasts.success('Account password was updated!');
      reset();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Paper padding="lg" shadow="md">
      <Title order={2}>Change password</Title>
      <Text className="mt-1">Manage your password settings.</Text>

      {error && (
        <Alert
          className="mt-3"
          icon={<BiErrorCircle />}
          title="Error"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(updateUserPassword)}>
        <Box className="mt-3 space-y-5">
          <Box className="space-y-2">
            <PasswordInput
              label="Current password"
              {...register('currentPassword')}
              error={errors?.currentPassword?.message}
            />
            <PasswordInput
              label="New password"
              {...register('newPassword')}
              error={errors?.newPassword?.message}
            />
            <PasswordInput
              label="Confirm password"
              {...register('confirmPassword')}
              error={errors?.confirmPassword?.message}
            />
          </Box>
          <Button type="submit" loading={isSubmitting}>
            Update password
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
