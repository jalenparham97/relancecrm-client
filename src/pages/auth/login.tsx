import { Alert, Box, Center, Container, Divider, Paper, Text, Title } from '@mantine/core';
import { useGoogleAuth, useLogin } from '@/app/api/auth';
import { BiErrorCircle } from 'react-icons/bi';
import { BsGoogle, BsMicrosoft } from 'react-icons/bs';
import LoginForm from '@/app/components/auth/LoginForm';
import PageShellBasic from '@/app/components/layouts/PageShellBasic';
import Link from '@/app/components/shared/Link';
import Button from '@/app/components/shared/Button';

export default function login() {
  const { login, error, clearError } = useLogin();
  const { loginWithGoogle } = useGoogleAuth();

  return (
    <PageShellBasic>
      <Box sx={{ marginTop: '100px' }}>
        <Container size="xs">
          <Box>
            <Title order={1} align="center">
              Login to your account
            </Title>
            <Text align="center" mt="sm" className="text-base">
              Don't have an account?{' '}
              <Link className="hover:underline text-indigo-500" to="/auth/signup">
                Sign up
              </Link>
            </Text>
          </Box>
          <Paper withBorder className="p-8 border-gray-600 border-opacity-20 shadow-sm" mt="lg">
            {error && (
              <Alert
                className="mb-2"
                icon={<BiErrorCircle />}
                title="Error"
                color="red"
                withCloseButton
                onClose={clearError}
              >
                Email or password is incorrect
              </Alert>
            )}
            <Box className="space-y-4">
              <LoginForm onFormSubmit={login} />
              <Divider
                my="xs"
                label="Or"
                labelPosition="center"
                classNames={{ label: 'text-base' }}
              />
              <Box className="space-y-3">
                <Button
                  className="bg-[#DB4437] hover:bg-[#DB4437]"
                  onClick={loginWithGoogle}
                  classNames={{
                    inner: 'flex items-center',
                    label: 'w-full',
                  }}
                  size="md"
                  fullWidth
                >
                  <BsGoogle />
                  <span className="flex-auto pl-14 pr-4 -ml-16">Continue with Google</span>
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </PageShellBasic>
  );
}
