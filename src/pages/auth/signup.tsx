import { Box, Center, Container, Paper, Text, Title, Divider } from '@mantine/core';
import { useGoogleAuth, useSignUp } from '@/app/api/auth';
import { BsGoogle, BsMicrosoft } from 'react-icons/bs';
import PageShellBasic from '@/app/components/layouts/PageShellBasic';
import SignupForm from '@/app/components/auth/SignupForm';
import Link from '@/app/components/shared/Link';
import Button from '@/app/components/shared/Button';

export default function login() {
  const { signup } = useSignUp();
  const { signUpWithGoogle } = useGoogleAuth();

  return (
    <PageShellBasic>
      <Box sx={{ marginTop: '100px' }}>
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
          <Paper withBorder className="p-8 border-gray-600 border-opacity-20 shadow-sm" mt="lg">
            <Box className="space-y-4">
              <SignupForm onFormSubmit={signup} />
              <Divider
                my="xs"
                label="Or"
                labelPosition="center"
                classNames={{ label: 'text-base' }}
              />
              <Box className="space-y-3">
                <Button
                  onClick={signUpWithGoogle}
                  className="bg-[#DB4437] hover:bg-[#DB4437]"
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
