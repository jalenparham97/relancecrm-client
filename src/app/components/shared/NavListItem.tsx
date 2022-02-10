import { useRouter } from 'next/router';
import { Box, Text, useMantineTheme } from '@mantine/core';
import Link from './Link';
import { useIsDarkMode } from '@/app/hooks/useIsDarkMode';
import { useColors } from '@/app/hooks/useColors';

interface Props {
  text: string;
  icon?: React.ReactNode;
  href: string;
}

export default function NavListItem({ text, icon, href }: Props) {
  const { pathname } = useRouter();
  const isDarkMode = useIsDarkMode();
  const colors = useColors();

  const isActive = pathname.split('/')[1] === href.split('/')[1];

  return (
    <Link to={href}>
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
          <Text className="mt-1 text-white">{icon}</Text>
        ) : (
          <Text className={`mt-1 ${isDarkMode && 'text-gray-400'}`}>{icon}</Text>
        )}
        <Box className="ml-5 leading-none">
          {isActive ? (
            <Text className="font-semibold text-white">{text}</Text>
          ) : (
            <Text className={`${isDarkMode && 'text-gray-400'}`}>{text}</Text>
          )}
        </Box>
      </Box>
    </Link>
  );
}
