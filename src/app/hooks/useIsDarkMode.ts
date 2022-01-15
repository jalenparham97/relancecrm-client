import { useMantineTheme } from '@mantine/core';

export const useIsDarkMode = () => {
  const theme = useMantineTheme();
  return theme.colorScheme === 'dark';
};
