import {
  Paper,
  Title,
  Box,
  Text,
  Group,
  Table,
  Divider,
  SimpleGrid,
  Center,
  Avatar,
} from '@mantine/core';
import { Invoice } from '@/core/types';
import {
  formatCurrency,
  formatDate,
  getInitials,
  getInvoiceSubtotal,
  getInvoiceTotal,
} from '@/app/utils';

interface Props {
  invoice: Invoice;
  lgWidth?: string;
}

export default function InvoicePreview({ invoice }: Props) {
  return (
    <Paper shadow="md">
      <Group position="right" className="pt-4 px-4">
        <Text>
          <span>INVOICE #</span>{' '}
          <span className="font-semibold text-lg">{invoice?.invoiceNumber}</span>
        </Text>
      </Group>

      <Box className="py-8 px-16">
        <Center>
          <Avatar src={null} alt="Vitaly Rtishchev" color="dark" size="xl">
            {getInitials(`${invoice?.fromName}`)}
          </Avatar>
        </Center>
        <Title order={1} className="text-center mt-6">
          INVOICE
        </Title>
      </Box>

      <Divider className="opacity-60" />

      <Box className="py-8 px-16">
        <SimpleGrid
          breakpoints={[
            { minWidth: 'xs', cols: 1 },
            { minWidth: 'md', cols: 2 },
          ]}
        >
          <Box className="space-y-1">
            <Text className="font-semibold">From</Text>
            <Text className="text-sm">{invoice?.fromName}</Text>
            <Text className="text-sm">{invoice?.fromCompany}</Text>
            <Text className="text-sm">{invoice?.fromAddress}</Text>
          </Box>
          <Box className="space-y-1">
            <Text className="font-semibold">To</Text>
            <Text className="text-sm">{invoice?.toName}</Text>
            <Text className="text-sm">{invoice?.toCompany}</Text>
            <Text className="text-sm">{invoice?.toAddress}</Text>
          </Box>
        </SimpleGrid>
      </Box>

      <Box className="pb-8 px-16">
        <SimpleGrid
          breakpoints={[
            { minWidth: 'xs', cols: 1 },
            { minWidth: 'md', cols: 2 },
          ]}
        >
          <Box className="space-y-1">
            <Text className="font-semibold">Issued on</Text>
            <Text className="text-sm">{formatDate(invoice?.issuedOn)}</Text>
          </Box>
          <Box className="space-y-1">
            <Text className="font-semibold">Due date</Text>
            <Text className="text-sm">{formatDate(invoice?.dueOn)}</Text>
          </Box>
        </SimpleGrid>
      </Box>

      <Divider className="opacity-60" />

      <Box className="pt-8 px-16">
        <Table className="table-fixed" verticalSpacing="xs">
          <thead>
            <tr>
              <th className="!px-0 !w-8/12">Description</th>
              <th className="!px-0 !w-1/3 !text-right">Units/hrs</th>
              <th className="!px-0 !w-1/3 !text-right">Rate</th>
              <th className="!px-0 !w-1/3 !text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items?.map((item) => (
              <tr key={item._id}>
                <td className="!px-0">{item.description}</td>
                <td className="!px-0 text-right">
                  {item.units} {item.unitsType}
                </td>
                <td className="!px-0 text-right">{formatCurrency(item.rate)}</td>
                <td className="!px-0 text-right">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      <Box className="px-16">
        <Divider className="opacity-60" />
        <Box className="py-4 space-y-2">
          <Box className="flex justify-between">
            <Text className="font-semibold text-sm">Subtotal</Text>
            <Text className="font-semibold text-sm">
              {formatCurrency(getInvoiceSubtotal(invoice?.items))}
            </Text>
          </Box>
          {invoice?.tax !== 0 && (
            <Box className="flex justify-between">
              <Text className="font-semibold text-sm">{invoice?.taxLabel}</Text>
              <Text className="font-semibold text-sm">-{formatCurrency(invoice?.tax)}</Text>
            </Box>
          )}
          {invoice?.discount !== 0 && (
            <Box className="flex justify-between">
              <Text className="font-semibold text-sm">Subtotal</Text>
              <Text className="font-semibold text-sm">{formatCurrency(invoice?.discount)}</Text>
            </Box>
          )}
        </Box>
        <Divider className="opacity-60" />
        <Box className="py-4 space-y-2">
          <Box className="flex justify-between">
            <Text className="font-semibold text-lg">Total amount</Text>
            <Text className="font-semibold">{formatCurrency(getInvoiceTotal(invoice))}</Text>
          </Box>
        </Box>
      </Box>

      {invoice?.notes && (
        <Box className="pt-2">
          <Divider className="opacity-60" />
          <Box className="pt-6 px-16">
            <Text className="font-semibold">Notes</Text>
            <Text>{invoice?.notes}</Text>
          </Box>
        </Box>
      )}

      <Box className="text-center mt-16 pb-8">
        <Text>Thank you for your business.</Text>
      </Box>
    </Paper>
  );
}
