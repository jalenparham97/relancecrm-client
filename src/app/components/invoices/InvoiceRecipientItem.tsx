import { Box, Group, Text, ActionIcon } from '@mantine/core';
import { FiPlus, FiX } from 'react-icons/fi';
import { Client } from '@/core/types';
import Avatar from '../shared/Avatar';

interface Props {
  client: Client;
  onCancel?: () => void;
  showCancel?: boolean;
  showEmail?: boolean;
  [x: string]: any;
}

export default function InvoiceRecipientItem({
  client,
  onCancel,
  showCancel = true,
  showName = true,
  showEmail = true,
  ...otherProps
}: Props) {
  return (
    <Group align="center" position="apart">
      <Group noWrap spacing="xs">
        <Avatar size={30} backgroundColor={client.backgroundColor} radius="xl">
          {client.initials}
        </Avatar>

        <Group noWrap spacing="xs">
          <Text>{client.fullName}</Text>
          {showEmail && (
            <Text color="dimmed" size="sm">
              {client.email}
            </Text>
          )}
        </Group>
      </Group>

      {showCancel && (
        <ActionIcon onClick={onCancel}>
          <FiX />
        </ActionIcon>
      )}
    </Group>
  );
}
