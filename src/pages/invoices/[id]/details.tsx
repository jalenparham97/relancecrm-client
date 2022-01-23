import { useRouter } from 'next/router';
import { Box, Container, Paper, Title, Grid, Col, Group, Divider } from '@mantine/core';
import { useInvoice } from '@/app/api/invoices';
import { InvoiceStatus } from '@/core/types';
import InvoiceDetailsHeader from '@/app/components/invoices/InvoiceDetailsHeader';
import InvoicePageShell from '@/app/components/invoices/InvoicePageShell';
import InvoicePreview from '@/app/components/invoices/InvoicePreview';
import Button from '@/app/components/shared/Button';
import InvoiceDetailsWidget from '@/app/components/invoices/InvoiceDetailsWidget';
import LoadingLoader from '@/app/components/shared/LoadingLoader';

export default function InvoiceDetailsPage() {
  const { query } = useRouter();
  const { data: invoice, isLoading } = useInvoice(query.id as string);

  return (
    <InvoicePageShell header={!isLoading && <InvoiceDetailsHeader invoice={invoice} />}>
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Container className="pt-[80px]" size="lg">
          <Grid gutter={40}>
            <Col span={7}>
              <InvoicePreview invoice={invoice} />
            </Col>
            <Col span={5}>
              <Paper padding="lg" shadow="md">
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
