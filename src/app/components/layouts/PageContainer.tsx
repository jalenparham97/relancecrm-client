import { AppShell, Box, MediaQuery } from '@mantine/core';
import AuthGuard from '@/app/guards/AuthGuard';

interface Props {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  children?: React.ReactNode;
  aside?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function PageContainer({
  header,
  children,
  aside,
  ...otherProps
}: Props) {
  return (
    <AuthGuard>
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
            <div>{aside}</div>
          </MediaQuery>
        }
      >
        <Box>{children}</Box>
      </AppShell>
    </AuthGuard>
  );
}
