import { Box, Group, Text, Paper } from '@mantine/core';

interface Props {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function EmptyState({ title, subtitle, icon, actionButton }: Props) {
  return (
    <Paper className="bg-transparent">
      <Group direction="column" align="center" grow>
        {icon}
        <Box className="text-center">
          <Text size="lg">{title}</Text>
          <Text size="lg">{subtitle}</Text>
        </Box>
        {actionButton}
      </Group>
    </Paper>
  );
}
