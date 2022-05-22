import { AppShell, Aside, Box, MediaQuery, Text } from '@mantine/core';
import AuthGuard from '@/app/guards/AuthGuard';
import { useAuth } from '@/app/api/auth';

interface Props {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  children?: React.ReactNode;
  aside?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  withAuth?: boolean;
}

export default function InvoicePageShell({
  header,
  children,
  aside,
  withAuth = true,
  ...otherProps
}: Props) {
  useAuth();

  return (
    <>
      {withAuth && (
        <AuthGuard>
          <AppShell
            navbarOffsetBreakpoint="sm"
            fixed
            header={header}
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[9]
                    : '#fbfcfc',
                paddingRight: '16px',
                paddingBottom: '40px',
              },
            })}
            aside={
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <>{aside}</>
              </MediaQuery>
            }
          >
            <Box>{children}</Box>
          </AppShell>
        </AuthGuard>
      )}
      {!withAuth && (
        <AppShell
          navbarOffsetBreakpoint="sm"
          fixed
          header={header}
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[9] : '#fbfcfc',
              paddingRight: '16px',
              paddingBottom: '40px',
            },
          })}
          aside={
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <>{aside}</>
            </MediaQuery>
          }
        >
          <Box>{children}</Box>
        </AppShell>
      )}
    </>
  );
}
