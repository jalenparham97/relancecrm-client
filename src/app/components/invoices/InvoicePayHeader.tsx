import { Box, Group, Header, Title, Text } from '@mantine/core';
import { formatCurrency, formatDate } from '@/app/utils';
import { Invoice, InvoiceStatus } from '@/core/types';
import { FiDownload } from 'react-icons/fi';
import Button from '@/app/components/shared/Button';
import InvoiceStatusBadge from './InvoiceStatusBadge';

interface Props {
  invoice?: Invoice;
}

export default function InvoicePayHeader({ invoice }: Props) {
  const isInvoicePaid = invoice?.status === InvoiceStatus.PAID;

  return (
    <Header
      height={70}
      p="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Group align="center" spacing="xl">
          <Box>
            <Title order={4}>
              Invoice to: {invoice?.toName} - {formatCurrency(invoice?.total)}
            </Title>
            <Text>
              Issued on: {formatDate(invoice?.issuedOn)} - Due on: {formatDate(invoice?.dueOn)}
            </Text>
          </Box>
          {isInvoicePaid && <InvoiceStatusBadge status={invoice?.status} />}
        </Group>
        <Group align="center">
          <Button leftIcon={<FiDownload />}>Download</Button>
        </Group>
      </Box>
    </Header>
  );
}
