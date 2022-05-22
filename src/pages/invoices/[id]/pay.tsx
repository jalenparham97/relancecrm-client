import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { useInvoicePay } from '@/app/api/invoices';
import { useCreateInvoiceCheckoutSession } from '@/app/api/payments';
import { InvoiceStatus, PaymentTypes } from '@/core/types';
import InvoicePageShell from '@/app/components/invoices/InvoicePageShell';
import InvoicePayHeader from '@/app/components/invoices/InvoicePayHeader';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import {
  Box,
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Divider,
} from '@mantine/core';
import InvoicePreview from '@/app/components/invoices/InvoicePreview';
import Button from '@/app/components/shared/Button';
import Link from '@/app/components/shared/Link';
import InvoiceZellePayModal from '@/app/components/invoices/InvoiceZellePayModal';
import { formatCurrency, formatDate } from '@/core/utils';
import Avatar from '@/app/components/shared/Avatar';
import { isEmpty } from 'lodash';
import InvoiceRecipientItem from '@/app/components/invoices/InvoiceRecipientItem';

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
  const isStripeOrPaypal = invoice?.paymentDetails?.paymentMethod === 'stripe';
  const isPaymentMethodConnected =
    (invoice?.paymentMethods &&
      Object.values(invoice?.paymentMethods).some(
        (method) => method.connected === true
      )) ||
    false;

  const getInvoicePaymentMethod = (paymentMethod: PaymentTypes) => {
    switch (paymentMethod) {
      case 'stripe':
        return 'Debit/Credit via Stripe';
      case 'manual':
        return 'Manually marked as paid';
      default:
        return '';
    }
  };

  return (
    <InvoicePageShell
      header={!isLoading && <InvoicePayHeader invoice={invoice} />}
      withAuth={false}
    >
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Container size={1320}>
          <Grid gutter={20}>
            <Grid.Col span={8}>
              <InvoicePreview invoice={invoice} />
            </Grid.Col>
            <Grid.Col span={4}>
              {isInvoicePaid && (
                <Paper
                  p="lg"
                  withBorder
                  className="border-gray-600 border-opacity-20 shadow-sm"
                >
                  <Box className="space-y-4">
                    <Group position="apart">
                      <Title order={3}>Details</Title>
                    </Group>
                    <Divider />
                    <Box className="space-y-6">
                      {invoice?.project && (
                        <Box className="space-y-2">
                          <Title order={5}>Connected project</Title>
                          <Group position="apart">
                            <Group noWrap spacing="xs">
                              <Avatar
                                size={30}
                                backgroundColor={
                                  invoice?.project.backgroundColor
                                }
                                radius="xl"
                              >
                                {invoice?.project.initials}
                              </Avatar>

                              <Box>
                                <Text>{invoice?.project.projectName}</Text>
                              </Box>
                            </Group>
                          </Group>
                        </Box>
                      )}
                      {!isEmpty(invoice?.recipients) && (
                        <Box className="space-y-2">
                          <Title order={5}>Additional recipients</Title>
                          {invoice.recipients.map((recipient) => (
                            <Box className="space-y-2">
                              <InvoiceRecipientItem
                                key={recipient._id}
                                client={recipient}
                                showCancel={false}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
                      {isPaymentMethodConnected && (
                        <Box className="space-y-2">
                          <Title order={5}>Payment methods</Title>
                          <Group>
                            {invoice?.paymentMethods?.stripe?.connected && (
                              <Badge
                                size="lg"
                                className="bg-[#635bff] text-white"
                              >
                                Stripe
                              </Badge>
                            )}
                            {invoice?.paymentMethods?.paypal?.connected && (
                              <Badge size="lg">Paypal</Badge>
                            )}
                            {invoice?.paymentMethods?.zelle?.connected && (
                              <Badge
                                size="lg"
                                className="bg-[#6d1ed4] text-white"
                              >
                                Zelle
                              </Badge>
                            )}
                          </Group>
                        </Box>
                      )}
                      <Box className="space-y-2">
                        <Title order={5}>Payment information</Title>
                        <Box className="space-y-2">
                          <Box className="flex justify-between">
                            <Text className="font-semibold">Date:</Text>
                            <Text>{formatDate(invoice?.paymentDate)}</Text>
                          </Box>
                          <Box className="flex justify-between">
                            <Text className="font-semibold">
                              Payment method:
                            </Text>
                            <Text>
                              {getInvoicePaymentMethod(
                                invoice?.paymentDetails?.paymentMethod
                              )}
                            </Text>
                          </Box>
                          <Box className="flex justify-between">
                            <Text className="font-semibold">Total amount:</Text>
                            <Text>{formatCurrency(invoice?.total)}</Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              )}
              {!isInvoicePaid && (
                <>
                  <Title order={2}>Pay now with</Title>
                  {invoice?.paymentMethods?.stripe?.connected && (
                    <Paper
                      p="lg"
                      withBorder
                      className="border-gray-600 border-opacity-20 shadow-sm"
                    >
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
                    <Paper
                      p="lg"
                      withBorder
                      className="border-gray-600 border-opacity-20 shadow-sm"
                    >
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
