import { Menu, UnstyledButton, Avatar, Divider, useMantineColorScheme } from '@mantine/core';
import { FiDollarSign, FiLogOut, FiSun, FiUser, FiMoon } from 'react-icons/fi';
import { useLogout, useUser } from '@/app/api/auth';
import { useColors, useIsDarkMode } from '@/app/hooks';
import Link from './Link';
import { HiOutlineSupport } from 'react-icons/hi';

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
      <Menu.Item
        component={Link}
        to="/settings/account"
        icon={<FiUser />}
        className="hover:bg-gray-500 hover:bg-opacity-20"
      >
        Account
      </Menu.Item>
      <Menu.Item
        component={Link}
        to="/settings/billing"
        icon={<FiDollarSign />}
        className="hover:bg-gray-500 hover:bg-opacity-20"
      >
        Billing
      </Menu.Item>
      <Menu.Item
        // component={Link}
        // to="/settings/billing"
        icon={<HiOutlineSupport />}
        className="hover:bg-gray-500 hover:bg-opacity-20"
      >
        Support
      </Menu.Item>
      <Divider />
      <Menu.Item
        icon={isDarkMode ? <FiSun /> : <FiMoon />}
        onClick={() => toggleColorScheme()}
        className="hover:bg-gray-500 hover:bg-opacity-20"
      >
        {isDarkMode ? 'Light' : 'Dark'} mode
      </Menu.Item>
      <Menu.Item
        icon={<FiLogOut />}
        onClick={logout}
        className="hover:bg-gray-500 hover:bg-opacity-20"
      >
        Logout
      </Menu.Item>
    </Menu>
  );
}
