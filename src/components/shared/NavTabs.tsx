import { Box, Divider } from '@mantine/core';
import { useIsDarkMode } from '@/hooks';

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
      <Divider className={`-mt-[2px] border-t-2 ${isDarkMode && 'border-dark-400'}`} />
    </Box>
  );
}
