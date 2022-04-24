import { AppShell, Box } from '@mantine/core';
import AuthGuard from '@/app/guards/AuthGuard';
import { useAuth } from '@/app/api/auth';

interface Props {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  children?: React.ReactNode;
}

export default function FormEditPageContainer({
  header,
  children,
  ...otherProps
}: Props) {
  useAuth();

  return (
    <AuthGuard>
      <AppShell
        fixed
        header={header}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : '#fbfcfc',
            paddingRight: '16px',
            paddingBottom: '40px',
          },
          root: {
            '--mantine-navbar-width': '0px',
          },
        })}
      >
        <Box>{children}</Box>
      </AppShell>
    </AuthGuard>
  );
}
