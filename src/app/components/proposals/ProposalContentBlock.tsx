import { Box, Paper, Text } from '@mantine/core';
import { useIsDarkMode } from '@/app/hooks';

interface Props {
  icon?: React.ReactNode;
  name?: string;
  onClick?: () => void;
}

export default function ProposalContentBlock({ icon, name, onClick }: Props) {
  const isDarkMode = useIsDarkMode();

  return (
    <Paper
      onClick={onClick}
      withBorder
      className={`px-3 py-2 flex items-center space-x-5 cursor-pointer transition-colors hover:shadow-md hover:border-indigo-500 ${
        isDarkMode ? 'border-gray-700 border-opacity-50' : 'border-gray-300'
      }`}
    >
      <Box className="pt-[5px]">{icon}</Box>
      <Text className="font-medium">{name}</Text>
    </Paper>
  );
}
