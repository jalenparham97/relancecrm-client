import { forwardRef, useState } from 'react';
import { Autocomplete, Box, Text, Group } from '@mantine/core';
import { Client } from '@/core/types';
import Avatar from '@/app/components/shared/Avatar';

interface Props {
  label?: string;
  setClient?: (client: Client) => void;
  clients?: Client[];
  client?: Client;
  isError?: boolean;
  errorMessage?: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, Client>(
  ({ fullName, email, initials, backgroundColor, ...other }: Client, ref) => (
    <div ref={ref} {...other}>
      <Group noWrap spacing="xs">
        <Avatar backgroundColor={backgroundColor} radius="xl">
          {initials}
        </Avatar>

        <Box>
          <Text>{fullName}</Text>
          <Text color="dimmed" size="sm">
            {email}
          </Text>
        </Box>
      </Group>
    </div>
  )
);

export default function ClientPicker({
  label = 'Add a client',
  setClient,
  clients,
  client,
  isError = false,
  errorMessage = 'Client is required',
}: Props) {
  console.log({ clients });

  const data = clients.map((client) => ({
    _id: client?._id,
    value: client?.fullName,
    email: client?.email,
    fullName: client?.fullName,
    initials: client?.initials,
    backgroundColor: client?.backgroundColor,
  }));

  const handleChange = (clientName: string) => {
    setClient(clients.find((client) => client.fullName === clientName));
  };

  return (
    <Autocomplete
      label={label}
      onChange={handleChange}
      defaultValue={client?.fullName}
      itemComponent={AutoCompleteItem}
      data={clients.map((client) => ({
        value: client?.fullName,
        email: client?.email,
        fullName: client?.fullName,
        initials: client?.initials,
        backgroundColor: client?.backgroundColor,
      }))}
      error={isError && errorMessage}
      filter={(value, item) =>
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.email.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
}
