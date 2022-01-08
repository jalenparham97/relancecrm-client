import { useMantineTheme } from '@mantine/core';

export const useColors = () => {
  const theme = useMantineTheme();
  return theme.colors;
};
