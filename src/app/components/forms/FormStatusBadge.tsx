import { Badge } from '@mantine/core';
import { FormStatus } from '@/core/types';

const colors = {
  [FormStatus.OPEN]: { color: 'green' },
  [FormStatus.CLOSED]: { color: 'red' },
};

interface Props {
  status: FormStatus;
}

export default function FormStatusBadge({ status }: Props) {
  return (
    <Badge color={colors[status].color} variant="filled">
      {status}
    </Badge>
  );
}
