import { Alert, Box, Center, Container, Paper, Text, Title } from '@mantine/core';
import { useLogin } from '@/api/auth';
import { BiErrorCircle } from 'react-icons/bi';
import LoginForm from '@/components/auth/LoginForm';
import PageShellBasic from '@/components/layouts/PageShellBasic';
import Link from '@/components/shared/Link';

export default function login() {
  const { login, error, clearError } = useLogin();

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
          <Paper className="p-8" shadow="xs" mt="lg" withBorder>
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
            <LoginForm onFormSubmit={login} />
          </Paper>
        </Container>
      </Box>
    </PageShellBasic>
  );
}
