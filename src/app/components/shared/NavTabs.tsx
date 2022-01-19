import { Box, Divider } from '@mantine/core';
import { useIsDarkMode } from '@/app/hooks';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function NavTabs({ children, className }: Props) {
  const isDarkMode = useIsDarkMode();

  return (
    <Box>
      <Box className={`flex space-x-2 pb-0 ${className}`}>
        <>{children}</>
      </Box>
      <Divider className={`border-t-1 ${isDarkMode && 'border-dark-400'}`} />
    </Box>
  );
}
