import { Badge } from '@mantine/core';
import { InvoiceStatus } from '@/core/types';

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
    <Badge variant="filled" color={colors[status].color}>
      {status}
    </Badge>
  );
}
