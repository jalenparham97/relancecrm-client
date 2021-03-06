import { useAuth } from '@/app/api/auth';
import { AppShell } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function PageShellBasic({ children, header, ...otherProps }: Props) {
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      fixed
      header={header}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
          paddingRight: '16px',
          paddingBottom: '40px',
        },
      })}
    >
      {children}
    </AppShell>
  );
}
