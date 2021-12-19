import { useRouter } from 'next/router';
import { Box, Container, Paper, Title, Grid, Col, Group, Divider } from '@mantine/core';
import { useInvoice } from '@/api/invoices';
import { InvoiceStatus } from '@/types';
import InvoiceDetailsHeader from '@/components/invoices/InvoiceDetailsHeader';
import InvoicePageShell from '@/components/invoices/InvoicePageShell';
import InvoicePreview from '@/components/invoices/InvoicePreview';
import Button from '@/components/shared/Button';
import InvoiceDetailsWidget from '@/components/invoices/InvoiceDetailsWidget';
import LoadingLoader from '@/components/shared/LoadingLoader';

export default function InvoiceDetailsPage() {
  const { query } = useRouter();
  const { data: invoice, isLoading } = useInvoice(query.id as string);

  return (
    <InvoicePageShell header={!isLoading && <InvoiceDetailsHeader invoice={invoice} />}>
      {isLoading && <LoadingLoader height="100vh" />}
      {!isLoading && (
        <Container className="pt-[80px]" size="xl">
          <Grid>
            <Col span={8}>
              <InvoicePreview invoice={invoice} />
            </Col>
            <Col span={4}>
              <Paper padding="lg" shadow="sm">
                <Box className="space-y-3">
                  <Group position="apart">
                    <Title order={3}>Details</Title>
                    {invoice?.status !== InvoiceStatus.PAID && (
                      <Button variant="default" size="xs" to={`/invoices/${query.id}/edit`}>
                        Edit
                      </Button>
                    )}
                  </Group>
                  <Divider />
                  <Box>
                    <InvoiceDetailsWidget invoice={invoice} />
                  </Box>
                </Box>
              </Paper>
            </Col>
          </Grid>
        </Container>
      )}
    </InvoicePageShell>
  );
}
