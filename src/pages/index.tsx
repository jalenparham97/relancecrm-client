import { Box, Container, Divider, Group, SimpleGrid, Title } from '@mantine/core';
import { FiUsers, FiDollarSign } from 'react-icons/fi';
import PageLayout from '@/components/layouts/PageLayout';
import StatCard from '@/components/shared/StatCard';
import { formatCurrency } from '@/utils';
import TasksDashboardWidget from '@/components/tasks/TasksDashboardWidget';

const IndexPage = () => (
  <PageLayout>
    <Container size="xl">
      <Box className="space-y-5">
        <Box className="flex justify-between items-center">
          <Title order={1}>Dashboard</Title>
        </Box>
        <SimpleGrid cols={4}>
          <StatCard
            icon={<FiUsers size={20} />}
            title="Total clients"
            content={8}
            link="/clients"
          />
          <StatCard
            icon={<FiDollarSign size={20} />}
            title="Total paid invoices"
            content={formatCurrency(8000)}
            link="/invoices"
          />
          <StatCard
            icon={<FiDollarSign size={20} />}
            title="Total paid invoices"
            content={formatCurrency(8000)}
            link="/invoices"
          />
          <StatCard
            icon={<FiDollarSign size={20} />}
            title="Total paid invoices"
            content={formatCurrency(8000)}
            link="/invoices"
          />
        </SimpleGrid>
        <TasksDashboardWidget />
      </Box>
    </Container>
  </PageLayout>
);

export default IndexPage;
