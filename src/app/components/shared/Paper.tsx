import { Paper as MantinePaper, SharedPaperProps } from '@mantine/core';
import { useIsDarkMode } from '@/app/hooks';

interface Props extends SharedPaperProps {
  children?: React.ReactChildren;
}

export default function Paper({ children, ...otherProps }: Props) {
  const isDarkMode = useIsDarkMode();

  return <Paper {...otherProps}>{children}</Paper>;
}
