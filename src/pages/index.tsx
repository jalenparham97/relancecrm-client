import { Box, Container, Group, Title } from '@mantine/core';
import PageLayout from '@/components/layouts/PageLayout';

const IndexPage = () => (
  <PageLayout>
    <Container size="xl">
      <Box>
        <Box className="flex justify-between items-center">
          <Title order={1}>Dashboard</Title>
        </Box>
      </Box>
    </Container>
  </PageLayout>
);

export default IndexPage;
