import { useState } from 'react';
import { AppShell, Navbar, Header, MediaQuery, Burger, Box, Text, Group } from '@mantine/core';
import {
  UilBill,
  UilFileQuestionAlt,
  UilSuitcaseAlt,
  UilEstate,
  UilUsersAlt,
  UilCheckSquare,
} from '@iconscout/react-unicons';
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
          <Header height={65} padding="md">
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
          <Navbar padding="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 270, lg: 270 }}>
            <Box className="w-full grid gap-1">
              <NavListItem
                href="/"
                icon={<UilEstate className="w-[20px] h-[20px]" />}
                text="Dashboard"
              />
              <NavListItem
                href="/clients"
                icon={<UilUsersAlt className="w-[20px] h-[20px]" />}
                text="Clients"
              />
              <NavListItem
                href="/projects"
                icon={<UilSuitcaseAlt className="w-[20px] h-[20px]" />}
                text="Projects"
              />
              <NavListItem
                href="/invoices"
                icon={<UilBill className="w-[20px] h-[20px]" />}
                text="Invoices"
              />
              <NavListItem
                href="/forms"
                icon={<UilFileQuestionAlt className="w-[20px] h-[20px]" />}
                text="Forms"
              />
              <NavListItem
                href="/tasks"
                icon={<UilCheckSquare className="w-[20px] h-[20px]" />}
                text="Tasks"
              />
            </Box>
          </Navbar>
        }
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
};

export default PageLayout;
