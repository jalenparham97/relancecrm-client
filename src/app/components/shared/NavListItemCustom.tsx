import { useRouter } from 'next/router';
import { Box, Text } from '@mantine/core';
import Link from './Link';
import { useIsDarkMode } from '@/app/hooks/useIsDarkMode';
import { useColors } from '@/app/hooks/useColors';
import TasksIcon from '@/app/components/shared/icons/TasksIcon';
import RecieptIcon from '@/app/components/shared/icons/RecieptIcon';
import DocumentIcon from '@/app/components/shared/icons/DocumentIcon';
import ReceiptIcon2 from './icons/ReceiptIcon2';
import FormIcon from './icons/FormIcon';

interface Props {
  text: string;
  icon?: string;
  href: string;
}

export default function NavListItemCustom({ text, icon, href }: Props) {
  const { pathname } = useRouter();
  const isDarkMode = useIsDarkMode();
  const colors = useColors();

  const isActive = pathname.split('/')[1] === href.split('/')[1];

  const icons = {
    invoices: {
      icon: <RecieptIcon color={isDarkMode ? colors.gray[4] : ''} />,
      activeIcon: <RecieptIcon color="#fff" />,
    },
    proposals: {
      icon: <DocumentIcon color={isDarkMode ? colors.gray[4] : ''} />,
      activeIcon: <DocumentIcon color={isDarkMode ? colors.indigo[5] : ''} />,
    },
  };

  return (
    <Link className="no-underline" to={href}>
      <Box
        className="w-full px-3 py-[5px] text-left transition-colors flex items-center rounded-[5px] cursor-pointer border-none"
        component="button"
        sx={(theme) => ({
          '&:hover': {
            backgroundColor: isActive
              ? isDarkMode
                ? colors.indigo[7]
                : colors.indigo[5]
              : isDarkMode
              ? colors.dark[5]
              : colors.gray[1],
          },
          backgroundColor: isActive
            ? isDarkMode
              ? colors.indigo[7]
              : colors.indigo[5]
            : 'transparent',
        })}
      >
        {isActive ? (
          <Text className="mt-1 text-white">{icons[icon].activeIcon}</Text>
        ) : (
          <Text className="mt-1">{icons[icon].icon}</Text>
        )}
        <Box className="ml-5 leading-none">
          {isActive ? (
            <Text className="font-semibold text-white">{text}</Text>
          ) : (
            <Text>{text}</Text>
          )}
        </Box>
      </Box>
    </Link>
  );
}
