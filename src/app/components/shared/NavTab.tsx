import { useRouter } from 'next/router';
import { Box, Text } from '@mantine/core';
import { useColors, useIsDarkMode } from '@/app/hooks';
import Link from './Link';

interface Props {
  to?: string;
  label: string;
  exact?: boolean;
  [x: string]: any;
}

export default function NavTab({ to, label, exact = true, ...otherProps }: Props) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const colors = useColors();

  const isRouteMatch = router.asPath === to;

  const borderBottomStyle = isRouteMatch
    ? `2px solid ${isDarkMode ? colors.indigo[4] : colors.indigo[6]}`
    : '2px solid transparent';

  return (
    <Link to={to}>
      <Box
        {...otherProps}
        className={`mr-4 h-[50px] flex justify-center items-center transition-all`}
        sx={{ borderBottom: borderBottomStyle }}
      >
        <Text
          className={`font-semibold transition-all duration-[150ms] ${
            isRouteMatch && (isDarkMode ? 'text-indigo-400' : 'text-indigo-600')
          }`}
        >
          {label}
        </Text>
      </Box>
    </Link>
  );
}
