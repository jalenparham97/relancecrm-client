import {
  Menu,
  UnstyledButton,
  Avatar,
  Divider,
  Text,
  Group,
  Box,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  IconCurrencyDollar,
  IconUser,
  IconLogout,
  IconLifebuoy,
  IconChevronRight,
  IconChevronDown,
} from '@tabler/icons';
import { useLogout, useUser } from '@/app/api/auth';
import { useColors } from '@/app/hooks';

interface Props {
  [x: string]: any;
}

export default function AccountMenu({ ...otherProps }: Props) {
  const user = useUser();
  const logout = useLogout();
  const colors = useColors();

  const getUserName = (email: string) => {
    return email?.split('@')[0];
  };

  return (
    <Menu
      {...otherProps}
      placement="end"
      size="lg"
      className="-mr-1"
      control={
        <UnstyledButton
          sx={(theme) => ({
            width: '100%',
            padding: '8px',
            borderRadius: '3px',
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[1],
            },
          })}
        >
          <Box className="flex items-center space-x-2">
            <Avatar
              src={user?.photoUrl}
              styles={{
                placeholder: {
                  backgroundColor: colors.indigo[6],
                  color: 'white',
                },
              }}
              radius="xl"
            >
              {user.initials}
            </Avatar>
            <IconChevronDown size={16} />
          </Box>
        </UnstyledButton>
      }
    >
      <Menu.Item
        component={NextLink}
        href="/settings/account"
        icon={<IconUser size={16} />}
      >
        Account
      </Menu.Item>
      <Menu.Item
        component={NextLink}
        href="/settings/billing"
        icon={<IconCurrencyDollar size={16} />}
      >
        Billing
      </Menu.Item>
      <Menu.Item
        // component={Link}
        // to="/settings/billing"
        icon={<IconLifebuoy size={16} />}
      >
        Support
      </Menu.Item>
      <Divider />
      {/* <Menu.Item
        icon={isDarkMode ? <FiSun /> : <FiMoon />}
        onClick={() => toggleColorScheme()}
        
      >
        {isDarkMode ? 'Light' : 'Dark'} mode
      </Menu.Item> */}
      <Menu.Item icon={<IconLogout size={16} />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );
}
