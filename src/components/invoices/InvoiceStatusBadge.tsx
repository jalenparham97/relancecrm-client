import { Badge } from '@mantine/core';
import { InvoiceStatus } from '@/types';

const colors = {
  [InvoiceStatus.PAID]: { color: 'green' },
  [InvoiceStatus.SENT]: { color: 'blue' },
  [InvoiceStatus.OVERDUE]: { color: 'red' },
  [InvoiceStatus.DRAFT]: { color: 'gray' },
};

interface Props {
  status: InvoiceStatus;
}

export default function InvoiceStatusBadge({ status }: Props) {
  return (
    <Badge variant="outline" color={colors[status].color}>
      {status}
    </Badge>
  );
}
