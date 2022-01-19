import { useUser } from '@/app/api/auth';
import { Box, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import { isEmpty } from 'lodash';
import Link from './Link';
import LoadingLoader from './LoadingLoader';

interface Props {
  icon?: React.ReactNode;
  title?: string;
  content?: React.ReactNode;
  link?: string;
  linkText?: string;
}

export default function StatCard({ icon, title, content, link, linkText = 'View all' }: Props) {
  const user = useUser();

  return (
    <Paper padding="lg" shadow="md">
      <Box className="space-y-3">
        <Box className="flex justify-between">
          <ThemeIcon size="xl">{icon}</ThemeIcon>
          <Link to={link} className="text-indigo-500 hover:text-indigo-600">
            {linkText}
          </Link>
        </Box>
        {!isEmpty(user) && (
          <Box>
            <Text className="text-base font-semibold">{title}</Text>
            <Text className="text-3xl">{content}</Text>
          </Box>
        )}
        {isEmpty(user) && <LoadingLoader height="100%" />}
      </Box>
    </Paper>
  );
}
