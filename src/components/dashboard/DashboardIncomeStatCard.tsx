import { useState } from 'react';
import { Box, Menu, Paper, Text, ThemeIcon, Button } from '@mantine/core';
import { FiChevronDown } from 'react-icons/fi';
import { useUser } from '@/api/auth';
import { isEmpty } from 'lodash';
import LoadingLoader from '../shared/LoadingLoader';

interface Props {
  icon?: React.ReactNode;
  title?: string;
  content?: React.ReactNode;
  link?: string;
  linkText?: string;
}

export default function DashboardIncomeStatCard({ icon, title, content }: Props) {
  const user = useUser();
  const [time, setTime] = useState('This month');

  const onClick = (e: React.SyntheticEvent) => {
    setTime(e.currentTarget.textContent);
  };

  return (
    <Paper padding="lg" shadow="xs" withBorder>
      <Box className="space-y-3">
        <Box className="flex justify-between">
          <ThemeIcon size={45}>{icon}</ThemeIcon>
          <Menu
            placement="end"
            control={
              <Button variant="default" compact rightIcon={<FiChevronDown size={16} />}>
                {time}
              </Button>
            }
          >
            <Menu.Item onClick={onClick}>This month</Menu.Item>
            <Menu.Item onClick={onClick}>Last month</Menu.Item>
            <Menu.Item onClick={onClick}>This year</Menu.Item>
            <Menu.Item onClick={onClick}>Last year</Menu.Item>
            <Menu.Item onClick={onClick}>Last year</Menu.Item>
            <Menu.Item onClick={onClick}>Last 30 days</Menu.Item>
            <Menu.Item onClick={onClick}>Last 90 days</Menu.Item>
          </Menu>
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
