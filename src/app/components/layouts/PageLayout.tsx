import { useState } from 'react';
import { AppShell, Navbar, Header, MediaQuery, Burger, Box, Text, Group } from '@mantine/core';
import { UilClipboardNotes } from '@iconscout/react-unicons';
import { IconHome, IconUsers, IconBriefcase, IconReceipt2, IconCircleCheck } from '@tabler/icons';
import { useUser } from '@/app/api/auth';
import { useIsDarkMode } from '@/app/hooks';
import dayjs from 'dayjs';
import AuthGuard from '@/app/guards/AuthGuard';
import NavListItem from '@/app/components/shared/NavListItem';
import Link from '@/app/components/shared/Link';
import AccountMenu from '@/app/components/shared/AccountMenu';

const PageLayout = ({ children, ...otherProps }) => {
  const user = useUser();
  const isDarkMode = useIsDarkMode();
  const [opened, setOpened] = useState(false);

  return (
    <AuthGuard>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        header={
          <Header height={65} p="md">
            <Box className="flex justify-between items-center h-full">
              <Box>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" mr="xl" />
                </MediaQuery>

                <Group>
                  <Link to="/">
                    <Box className="flex items-center space-x-2">
                      <img
                        className="w-10 !-ml-2 h-10"
                        src="/assets/logos/relance-logo.svg"
                        alt=""
                      />
                      {isDarkMode ? (
                        <img className="w-28 !-ml-2" src="/assets/logos/logo-light.svg" alt="" />
                      ) : (
                        <img
                          className="w-28 h-10 !-ml-2"
                          src="/assets/logos/logo-dark.svg"
                          alt=""
                        />
                      )}
                    </Box>
                  </Link>
                  {dayjs().isBefore(user?.subscription?.trialEndDate) && (
                    <Text>
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
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 270, lg: 270 }}>
            <Box className="w-full grid gap-1">
              <NavListItem href="/" icon={<IconHome size={20} />} text="Dashboard" />
              <NavListItem href="/clients" icon={<IconUsers size={20} />} text="Clients" />
              <NavListItem href="/projects" icon={<IconBriefcase size={20} />} text="Projects" />
              <NavListItem href="/invoices" icon={<IconReceipt2 size={20} />} text="Invoices" />
              <NavListItem href="/forms" icon={<UilClipboardNotes size={20} />} text="Forms" />
              <NavListItem href="/tasks" icon={<IconCircleCheck size={20} />} text="Tasks" />
            </Box>
          </Navbar>
        }
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : '#fbfcfc',
            // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : '#fff',
            paddingRight: '16px',
            paddingBottom: '40px',
          },
        })}
      >
        <Box>{children}</Box>
      </AppShell>
    </AuthGuard>
  );
};

export default PageLayout;
