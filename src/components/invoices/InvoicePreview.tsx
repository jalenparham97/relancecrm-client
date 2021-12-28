import { Paper, Title, Box, Text, Group, Grid, Col, Table, Divider } from '@mantine/core';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface Props {
  invoice: Invoice;
  lgWidth?: string;
}

export default function InvoicePreview({ invoice }: Props) {
  return (
    <Paper shadow="sm" padding="xl" withBorder>
      <Group direction="column">
        <Title order={2}>INVOICE</Title>
        <Box>
          <Text>Invoice #: {invoice?.invoiceNumber}</Text>
          <Text>Issued: {formatDate(invoice?.issuedOn)}</Text>
          <Text>Due: {formatDate(invoice?.dueOn)}</Text>
        </Box>
      </Group>

      <Box className="mt-8">
        <Grid>
          <Col span={4}>
            <Text className="font-semibold">From:</Text>
            <Text>{invoice?.fromName}</Text>
            <Text>{invoice?.fromCompany}</Text>
            <Text>{invoice?.fromAddress}</Text>
          </Col>
          <Col span={6} className="-ml-8">
            <Text className="font-semibold">To:</Text>
            <Text>{invoice?.toName}</Text>
            <Text>{invoice?.toCompany}</Text>
            <Text>{invoice?.toAddress}</Text>
          </Col>
        </Grid>
      </Box>

      <Box className="mt-8">
        <Table className="table-fixed">
          <thead>
            <tr>
              <th className="!px-0 !w-8/12">Description</th>
              <th className="!px-0 !w-1/4">Units/hrs</th>
              <th className="!px-0 !w-1/4">Rate</th>
              <th className="!px-0 !w-1/4">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items?.map((item) => (
              <tr key={item._id}>
                <td className="!px-0 !py-3">{item.description}</td>
                <td className="!px-0 !py-3">
                  {item.units} {item.unitsType}
                </td>
                <td className="!px-0 !py-3">{formatCurrency(item.rate)}</td>
                <td className="!px-0 !py-3">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      <Divider className="opacity-60" />

      <Box className="mt-5">
        <Grid justify="space-between">
          <Col span={6}></Col>
          <Col span={4} className="space-y-2">
            <Group position="apart">
              <Text className="font-semibold">Subtotal:</Text>
              <Text>{formatCurrency(invoice?.subtotal)}</Text>
            </Group>
            {invoice?.tax !== 0 && (
              <Group position="apart">
                <Text className="font-semibold">{`${invoice?.taxLabel}:`}</Text>
                <Text>{formatCurrency(invoice?.tax)}</Text>
              </Group>
            )}
            {invoice?.discount !== 0 && (
              <Group position="apart">
                <Text className="font-semibold">Discount:</Text>
                <Text>{formatCurrency(invoice?.discount)}</Text>
              </Group>
            )}
            <Divider className="opacity-60" />
            <Group position="apart">
              <Text className="font-semibold">Total:</Text>
              <Text>{formatCurrency(invoice?.total)}</Text>
            </Group>
          </Col>
        </Grid>
      </Box>

      {invoice?.notes && (
        <Box className="mt-5 space-y-2">
          <Divider className="opacity-60" />
          <Box>
            <Text className="font-semibold">Notes</Text>
            <Text>{invoice?.notes}</Text>
          </Box>
        </Box>
      )}

      <Box className="text-center mt-16">
        <Text>Thank you for your business.</Text>
      </Box>
    </Paper>
  );
}
