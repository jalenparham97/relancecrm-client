import { AppShell, Box } from '@mantine/core';
import AuthGuard from '@/app/guards/AuthGuard';
import { useAuth } from '@/app/api/auth';

interface Props {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  children?: React.ReactNode;
}

export default function InvoicePageShell({ header, children, ...otherProps }: Props) {
  useAuth();

  return (
    <AuthGuard>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        header={header}
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : '#fbfcfc',
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
