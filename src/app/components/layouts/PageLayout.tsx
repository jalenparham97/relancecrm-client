import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  Title,
  Box,
  Text,
  Group,
} from '@mantine/core';
import { FiUsers, FiCheckSquare, FiBriefcase, FiHome } from 'react-icons/fi';
import { useUser } from '@/app/api/auth';
import dayjs from 'dayjs';
import AuthGuard from '@/app/guards/AuthGuard';
import NavListItem from '@/app/components/shared/NavListItem';
import Link from '@/app/components/shared/Link';
import NavListItemCustom from '@/app/components/shared/NavListItemCustom';
import AccountMenu from '@/app/components/shared/AccountMenu';

const PageLayout = ({ children, ...otherProps }) => {
  const user = useUser();
  const [opened, setOpened] = useState(false);

  return (
    <AuthGuard>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        header={
          <Header height={60} padding="md" className="bg-dark-700">
            <Box className="flex justify-between items-center h-full">
              <Box>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" mr="xl" />
                </MediaQuery>

                <Group>
                  <Link to="/">
                    <Box className="flex items-center space-x-2">
                      <img className="w-8 h-8" src="/assets/logos/logo.png" alt="" />
                      <Title order={2} className="text-white">
                        Relance
                      </Title>
                    </Box>
                  </Link>
                  {dayjs().isBefore(user?.subscription?.trialEndDate) && (
                    <Text className="text-white">
                      <span className="font-semibold">
                        {Math.abs(dayjs(Date.now()).diff(user?.subscription?.trialEndDate, 'days'))}
                      </span>{' '}
                      days left in free trial
                    </Text>
                  )}
                </Group>
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
              <NavListItem href="/projects" icon={<FiBriefcase />} text="Projects" />
              <NavListItemCustom href="/invoices" icon="invoices" text="Invoices" />
              <NavListItem href="/tasks" icon={<FiCheckSquare />} text="Tasks" />
            </Box>
          </Navbar>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
            paddingRight: '16px',
            paddingBottom: '30px',
          },
        })}
      >
        <Box>{children}</Box>
      </AppShell>
    </AuthGuard>
  );
};

export default PageLayout;
