import { Box, TextInput, Group, Button, Anchor, PasswordInput } from '@mantine/core';
import { FormProps, UserLoginData } from '@/core/types';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useYupResolver } from '@/app/hooks/useYupResolver';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface Props extends FormProps<UserLoginData> {}

export default function LoginForm({ onFormSubmit, loading }: Props) {
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<UserLoginData>({ resolver });

  const onSubmit = async (data: UserLoginData) => {
    await onFormSubmit(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group direction="column" grow>
          <TextInput
            {...register('email')}
            icon={<HiOutlineMail size="20px" />}
            placeholder="Your name"
            label="Email"
            error={formErrors.email && formErrors.email.message}
          />
          <Box>
            <PasswordInput
              {...register('password')}
              icon={<HiOutlineLockClosed size="20px" />}
              label="Password"
              placeholder="Your password"
              error={formErrors.password && formErrors.password.message}
            />
            <Box style={{ marginTop: '5px' }}>
              <Anchor href="https://jalenparham.com/" target="_blank">
                Forgot password?
              </Anchor>
            </Box>
          </Box>
          <Button loading={isSubmitting} type="submit">
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
}
