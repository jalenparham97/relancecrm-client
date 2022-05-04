import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { useInvoicePay } from '@/app/api/invoices';
import { useCreateInvoiceCheckoutSession } from '@/app/api/payments';
import { InvoiceStatus, PaymentTypes } from '@/core/types';
import InvoicePageShell from '@/app/components/invoices/InvoicePageShell';
import InvoicePayHeader from '@/app/components/invoices/InvoicePayHeader';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import { Box, Container, Grid, Paper, Title, Text } from '@mantine/core';
import InvoicePreview from '@/app/components/invoices/InvoicePreview';
import Button from '@/app/components/shared/Button';
import Link from '@/app/components/shared/Link';
import InvoiceZellePayModal from '@/app/components/invoices/InvoiceZellePayModal';

export default function InvoicePayPage() {
  const { query } = useRouter();
  const [openZelleDialog, toggleOpenZelleDialog] = useToggle(false);
  const { data: invoice, isLoading } = useInvoicePay(query?.id as string);
  const { initiateCheckoutSession, isLoading: isStripeLoading } =
    useCreateInvoiceCheckoutSession();

  const createCheckoutSession = async () => {
    await initiateCheckoutSession({
      invoiceId: invoice?._id,
      lineItems: invoice?.items,
      stripeAccountId: invoice?.paymentMethods.stripe.accountId,
    });
  };

  const isInvoicePaid = invoice?.status === InvoiceStatus.PAID;

  const getInvoicePaymentMethod = (paymentMethod: PaymentTypes) => {
    switch (paymentMethod) {
      case 'stripe':
        return 'Debit/Credit via Stripe';
      case 'manual':
        return 'Payment was manually marked as paid';
      default:
        return '';
    }
  };

  return (
    <InvoicePageShell
      header={!isLoading && <InvoicePayHeader invoice={invoice} />}
    >
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Container size="lg">
          <Grid gutter="lg">
            <Grid.Col span={8}>
              <InvoicePreview invoice={invoice} />
            </Grid.Col>
            <Grid.Col span={4}>
              <Box className="space-y-4">
                {!isInvoicePaid && (
                  <>
                    <Title order={2}>Pay now with</Title>
                    {invoice?.paymentMethods?.stripe?.connected && (
                      <Paper p="lg" shadow="md">
                        <Box className="space-y-3">
                          <Text>Credit & Debit cards</Text>
                          <Box className="flex justify-between items-center">
                            <img
                              alt="Visa Logo"
                              src="/assets/logos/visa-logo.svg"
                              style={{ width: '50px', height: '20px' }}
                            />
                            <img
                              alt="Mastercard Logo"
                              src="/assets/logos/mastercard-logo.svg"
                              style={{ width: '50px', height: '30px' }}
                            />
                            <img
                              alt="American Express Logo"
                              src="/assets/logos/aexpress-logo.svg"
                              style={{ width: '50px', height: '30px' }}
                            />
                            <img
                              alt="Apple Pay Logo"
                              src="/assets/logos/applepay-logo.svg"
                              style={{ width: '50px', height: '40px' }}
                            />
                            <img
                              alt="Google Pay Logo"
                              src="/assets/logos/gpay-logo.svg"
                              style={{ width: '50px', height: '40px' }}
                            />
                          </Box>
                          <Button
                            className="w-full"
                            onClick={createCheckoutSession}
                            loading={isStripeLoading}
                          >
                            Pay now
                          </Button>
                        </Box>
                      </Paper>
                    )}
                    {invoice?.paymentMethods?.zelle?.connected && (
                      <Paper p="lg" shadow="md">
                        <Box className="space-y-3">
                          <img
                            src="/assets/logos/zelle-logo.svg"
                            alt="Zelle Logo"
                            style={{
                              width: '80px',
                              height: '35px',
                              marginLeft: '-13px',
                            }}
                          />
                          <Text>
                            Zelle payments are processed outside of Relance.{' '}
                            <Link>Learn what this means</Link>
                          </Text>
                          <Button
                            className="w-full"
                            onClick={toggleOpenZelleDialog}
                          >
                            Pay now
                          </Button>
                        </Box>
                      </Paper>
                    )}
                  </>
                )}
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      )}

      <InvoiceZellePayModal
        opened={openZelleDialog}
        onClose={toggleOpenZelleDialog}
        accountId={invoice?.paymentMethods?.zelle?.accountId || ''}
      />
    </InvoicePageShell>
  );
}
