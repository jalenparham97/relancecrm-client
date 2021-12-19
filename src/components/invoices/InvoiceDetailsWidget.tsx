import { isEmpty } from 'lodash';
import { Group, Box, Alert, Text, Title, Badge } from '@mantine/core';
import { Invoice, InvoiceStatus } from '@/types';
import { useUser } from '@/api/auth';
import { getInvoicePaymentMethod, formatDate, formatCurrency } from '@/utils';
import InvoiceRecipientItem from './InvoiceRecipientItem';
import Link from '@/components/shared/Link';
import Avatar from '@/components/shared/Avatar';
import { FiArrowRight, FiCreditCard } from 'react-icons/fi';

interface Props {
  invoice: Invoice;
}

export default function InvoiceDetailsWidget({ invoice }: Props) {
  const user = useUser();
  const isInvoicePaid = invoice?.status === InvoiceStatus.PAID;

  const isPaymentMethodConnected =
    (invoice?.paymentMethods &&
      Object.values(invoice?.paymentMethods).some((method) => method.connected === true)) ||
    false;

  const isUserPaymentMethodConnected =
    (user?.connectedPayments &&
      Object.values(user?.connectedPayments).some((method) => method.isEnabled === true)) ||
    false;

  const isStripeOrPaypal = invoice?.paymentDetails?.paymentMethod === 'stripe';

  const isNoInvoiceData =
    !invoice?.project &&
    isEmpty(invoice?.recipients) &&
    !isPaymentMethodConnected &&
    !isInvoicePaid;

  const invoicePaymentsLink = isUserPaymentMethodConnected
    ? `/invoices/${invoice?._id}/edit`
    : '/settings/payments';

  if (isNoInvoiceData) {
    return <InvoicePaymentAlert invoicePaymentsLink={invoicePaymentsLink} />;
  }

  return (
    <Box className="space-y-6">
      {/* {invoice?.project && (
        <Box className="space-y-2">
          <Title order={5}>Connected project</Title>
          <Group position="apart">
            <Group noWrap spacing="xs">
              <Avatar size={30} backgroundColor={invoice?.project.backgroundColor} radius="xl">
                {invoice?.project.initials}
              </Avatar>

              <Box>
                <Text>{invoice?.project.projectName}</Text>
              </Box>
            </Group>
          </Group>
        </Box>
      )} */}
      {!isEmpty(invoice?.recipients) && (
        <Box className="space-y-2">
          <Title order={5}>Additional recipients</Title>
          {invoice.recipients.map((recipient) => (
            <Box className="space-y-2">
              <InvoiceRecipientItem key={recipient._id} client={recipient} showCancel={false} />
            </Box>
          ))}
        </Box>
      )}
      {isPaymentMethodConnected && (
        <Box className="space-y-2">
          <Title order={5}>Payment methods</Title>
          <Group>
            {invoice?.paymentMethods?.stripe?.connected && (
              <Badge size="lg" className="bg-[#635bff] text-white">
                Stripe
              </Badge>
            )}
            {invoice?.paymentMethods?.paypal?.connected && <Badge size="lg">Paypal</Badge>}
            {invoice?.paymentMethods?.zelle?.connected && (
              <Badge size="lg" className="bg-[#6d1ed4] text-white">
                Zelle
              </Badge>
            )}
          </Group>
        </Box>
      )}
      {!isUserPaymentMethodConnected && !isInvoicePaid && (
        <Box>
          <InvoicePaymentAlert invoicePaymentsLink={invoicePaymentsLink} />
        </Box>
      )}
      {isInvoicePaid && (
        <Box className="space-y-2">
          <Title order={5}>Payment information</Title>
          <Box className="space-y-2">
            <Box className="flex justify-between">
              <Text className="font-semibold">Date:</Text>
              <Text>{formatDate(invoice?.paymentDate)}</Text>
            </Box>
            <Box className="flex justify-between">
              <Text className="font-semibold">Payment method:</Text>
              <Box>{getInvoicePaymentMethod(invoice?.paymentDetails?.paymentMethod)}</Box>
            </Box>
            {isStripeOrPaypal && (
              <>
                <Box className="flex justify-between">
                  <Text className="font-semibold">Net amount:</Text>
                  <Text>{formatCurrency(invoice?.paymentDetails.net)}</Text>
                </Box>
                <Box className="flex justify-between">
                  <Text className="font-semibold">Fee:</Text>
                  <Text>{formatCurrency(invoice?.paymentDetails.fee)}</Text>
                </Box>
              </>
            )}
            <Box className="flex justify-between">
              <Text className="font-semibold">Amount:</Text>
              <Text>{formatCurrency(invoice?.total)}</Text>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

interface InvoicePaymentAlertProps {
  invoicePaymentsLink: string;
}

function InvoicePaymentAlert({ invoicePaymentsLink }: InvoicePaymentAlertProps) {
  return (
    <Box mt={1.5}>
      <Alert
        title="Get paid even faster"
        icon={<FiCreditCard size="50px" />}
        color="blue"
        classNames={{ label: 'text-[18px] leading-none mt-[2px]' }}
      >
        <Box className="space-y-3">
          <Text>Enable card payments on the invoice, to get paid even faster!</Text>
          <Link to={invoicePaymentsLink}>
            <Box className="mt-2">
              <Link to={invoicePaymentsLink}>
                <Text color="blue" className="font-semibold flex items-center gap-2">
                  Activate it now <FiArrowRight />
                </Text>
              </Link>
            </Box>
          </Link>
        </Box>
      </Alert>
    </Box>
  );
}
