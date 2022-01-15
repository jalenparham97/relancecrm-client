import { Box, Container, SimpleGrid, Title } from '@mantine/core';
import { FiDollarSign } from 'react-icons/fi';
import { formatCurrency } from '@/app/utils';
import PageLayout from '@/app/components/layouts/PageLayout';
import StatCard from '@/app/components/shared/StatCard';
import DashboardTasksWidget from '@/app/components/dashboard/DashboardTasksWidget';
import DashboardProjectsWidget from '@/app/components/dashboard/DashboardProjectsWidget';
import ReceiptIcon2 from '@/app/components/shared/icons/ReceiptIcon2';
import DashboardIncomeStatCard from '@/app/components/dashboard/DashboardIncomeStatCard';

const IndexPage = () => (
  <PageLayout>
    <Container size="xl">
      <Box className="space-y-5">
        <Box className="flex justify-between items-center">
          <Title order={1}>Dashboard</Title>
        </Box>
        <SimpleGrid cols={2}>
          <DashboardIncomeStatCard
            icon={<FiDollarSign size={20} />}
            title="Total income"
            content={formatCurrency(2000)}
          />
          <StatCard
            icon={<ReceiptIcon2 size={23} />}
            title="Outstanding invoices"
            content={formatCurrency(250)}
            link="/invoices"
          />
        </SimpleGrid>
        <DashboardTasksWidget />
        <DashboardProjectsWidget />
      </Box>
    </Container>
  </PageLayout>
);

export default IndexPage;
