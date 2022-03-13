import { Menu, UnstyledButton, Avatar, Divider, useMantineColorScheme } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconCurrencyDollar, IconUser, IconLogout, IconLifebuoy } from '@tabler/icons';
import { useLogout, useUser } from '@/app/api/auth';
import { useColors, useIsDarkMode } from '@/app/hooks';

interface Props {
  [x: string]: any;
}

export default function AccountMenu({ ...otherProps }: Props) {
  const { toggleColorScheme } = useMantineColorScheme();
  const isDarkMode = useIsDarkMode();

  const user = useUser();
  const logout = useLogout();
  const colors = useColors();

  return (
    <Menu
      {...otherProps}
      control={
        <UnstyledButton>
          <Avatar
            src={user?.photoUrl}
            styles={{ placeholder: { backgroundColor: colors.indigo[6], color: 'white' } }}
            radius="xl"
          >
            {user.initials}
          </Avatar>
        </UnstyledButton>
      }
    >
      <Menu.Item component={NextLink} href="/settings/account" icon={<IconUser size={16} />}>
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
