import { Box, Paper, Text } from '@mantine/core';
import { useIsDarkMode } from '@/app/hooks';

interface Props {
  icon?: React.ReactNode;
  name?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ProposalContentBlock({
  icon,
  name,
  onClick,
  disabled,
}: Props) {
  const isDarkMode = useIsDarkMode();

  return (
    <>
      {disabled ? (
        <Paper
          withBorder
          className={`px-3 py-2 flex items-center space-x-5 transition-colors w-full cursor-default bg-gray-100`}
        >
          <Box className="pt-[5px]">{icon}</Box>
          <Text className="font-medium">{name}</Text>
        </Paper>
      ) : (
        <Paper
          onClick={onClick}
          withBorder
          className={`px-3 py-2 flex items-center space-x-5 cursor-pointer transition-colors hover:shadow-md hover:border-indigo-500 w-full ${
            isDarkMode ? 'border-gray-700 border-opacity-50' : 'border-gray-300'
          } ${
            disabled &&
            'bg-gray-200 hover:shadow-none hover:border-gray-300 hover:cursor-default'
          }`}
        >
          <Box className="pt-[5px]">{icon}</Box>
          <Text className="font-medium">{name}</Text>
        </Paper>
      )}
    </>
  );
}
