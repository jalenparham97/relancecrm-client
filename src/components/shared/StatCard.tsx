import { Box, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import Link from './Link';

interface Props {
  icon?: React.ReactNode;
  title?: string;
  content?: React.ReactNode;
  link?: string;
  linkText?: string;
}

export default function StatCard({ icon, title, content, link, linkText = 'View all' }: Props) {
  return (
    <Paper padding="lg" shadow="sm" withBorder>
      <Box className="space-y-3">
        <Box className="flex justify-between">
          <ThemeIcon size={45}>{icon}</ThemeIcon>
          <Link to={link} className="text-indigo-500">
            {linkText}
          </Link>
        </Box>
        <Box>
          <Text className="text-base font-semibold">{title}</Text>
          <Text className="text-3xl">{content}</Text>
        </Box>
      </Box>
    </Paper>
  );
}
