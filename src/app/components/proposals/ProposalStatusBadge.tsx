import { Badge } from '@mantine/core';
import { ProposalStatus } from '@/core/types';

const colors = {
  [ProposalStatus.DRAFT]: { color: 'gray' },
  [ProposalStatus.APPROVED]: { color: 'green' },
  [ProposalStatus.DECLINED]: { color: 'red' },
};

interface Props {
  status: ProposalStatus;
}

export default function ProposalStatusBadge({ status }: Props) {
  return (
    <Badge color={colors[status].color} variant="filled">
      {status}
    </Badge>
  );
}
