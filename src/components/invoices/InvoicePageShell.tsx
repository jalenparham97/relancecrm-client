import { AppShell, Box } from '@mantine/core';
import AuthGuard from '@/guards/AuthGuard';

interface Props {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  children?: React.ReactNode;
}

export default function InvoicePageShell({ header, children, ...otherProps }: Props) {
  return (
    <AuthGuard>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        header={header}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
            paddingRight: '16px',
            paddingBottom: '20px',
          },
        })}
      >
        <Box>{children}</Box>
      </AppShell>
    </AuthGuard>
  );
}
