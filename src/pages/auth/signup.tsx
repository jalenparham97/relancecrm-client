import { Box, Center, Container, Paper, Text, Title } from '@mantine/core';
import { useSignUp } from '@/api/auth';
import PageShellBasic from '@/components/layouts/PageShellBasic';
import SignupForm from '@/components/auth/SignupForm';
import Link from '@/components/shared/Link';

export default function login() {
  const { signup } = useSignUp();

  return (
    <PageShellBasic>
      <Box style={{ marginTop: '200px' }}>
        <Container size="xs">
          <Box>
            <Title order={1} align="center">
              Create a new account
            </Title>
            <Text align="center" mt="sm" className="text-base">
              Already have an account?{' '}
              <Link className="hover:underline text-indigo-500" to="/auth/login">
                Login
              </Link>
            </Text>
          </Box>
          <Paper padding="xl" shadow="sm" mt="lg" withBorder>
            <SignupForm onFormSubmit={signup} />
          </Paper>
        </Container>
      </Box>
    </PageShellBasic>
  );
}
