import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Title,
  Box,
} from '@mantine/core';
import { FiUsers, FiCheckSquare, FiBriefcase, FiHome } from 'react-icons/fi';
import AuthGuard from '@/guards/AuthGuard';
import NavListItem from '@/components/shared/NavListItem';
import Link from '@/components/shared/Link';
import NavListItemCustom from '@/components/shared/NavListItemCustom';
import Button from '@/components/shared/Button';
import { useLogout } from '@/api/auth';
import AccountMenu from '@/components/shared/AccountMenu';

const PageLayout = ({ children, ...otherProps }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const logout = useLogout();

  return (
    <AuthGuard>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        header={
          <Header height={60} padding="md" className="bg-dark-700">
            <Box className="flex justify-between items-center h-full">
              <Box>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                  <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" mr="xl" />
                </MediaQuery>

                <Link to="/">
                  <Title order={2} className="text-white">
                    Relance CRM
                  </Title>
                </Link>
              </Box>
              <AccountMenu />
            </Box>
          </Header>
        }
        navbar={
          <Navbar padding="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 270, lg: 270 }}>
            <Box className="w-full grid gap-1">
              <NavListItem href="/" icon={<FiHome />} text="Dashboard" />
              <NavListItem href="/clients" icon={<FiUsers />} text="Clients" />
              <NavListItemCustom href="/invoices" icon="invoices" text="Invoices" />
              <NavListItem href="/tasks" icon={<FiCheckSquare />} text="Tasks" />
            </Box>
          </Navbar>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
            paddingRight: '16px',
            paddingBottom: '30px',
          },
        })}
      >
        {children}
      </AppShell>
    </AuthGuard>
  );
};

export default PageLayout;
