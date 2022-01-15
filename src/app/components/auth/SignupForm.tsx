import { TextInput, Group, Button, Anchor, PasswordInput, Box } from '@mantine/core';
import { FormProps, UserLoginData, UserSignupData } from '@/core/types';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useYupResolver } from '@/app/hooks/useYupResolver';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface Props extends FormProps<UserSignupData> {}

export default function SignupForm({ onFormSubmit, loading }: Props) {
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<UserSignupData>({ resolver });

  const onSubmit = async (data: UserSignupData) => {
    await onFormSubmit(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group direction="column" grow>
          <TextInput
            {...register('firstName')}
            placeholder="Your first name"
            label="First name"
            error={formErrors.firstName && formErrors.firstName.message}
          />
          <TextInput
            {...register('lastName')}
            placeholder="Your last name"
            label="Last name"
            error={formErrors.lastName && formErrors.lastName.message}
          />
          <TextInput
            {...register('email')}
            icon={<HiOutlineMail size="20px" />}
            placeholder="Your email"
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
            Sign up
          </Button>
        </Group>
      </form>
    </Box>
  );
}
