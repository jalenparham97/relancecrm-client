import { Badge } from '@mantine/core';
import { ProjectStatus } from '@/core/types';

const colors = {
  [ProjectStatus.ACTIVE]: { color: 'green' },
  [ProjectStatus.DONE]: { color: 'brand' },
};

interface Props {
  status: ProjectStatus;
}

export default function ProjectStatusBadge({ status }: Props) {
  return (
    <Badge variant="filled" color={colors[status].color}>
      {status}
    </Badge>
  );
}
