import { AppShell, Box } from '@mantine/core';
import AuthGuard from '@/app/guards/AuthGuard';
import { useAuth } from '@/app/api/auth';

interface Props {
  children?: React.ReactNode;
}

export default function FormPreviewPageContainer({ children, ...otherProps }: Props) {
  useAuth();

  return (
    <AuthGuard>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
            paddingRight: '16px',
            paddingBottom: '40px',
          },
        })}
      >
        <Box>{children}</Box>
      </AppShell>
    </AuthGuard>
  );
}
