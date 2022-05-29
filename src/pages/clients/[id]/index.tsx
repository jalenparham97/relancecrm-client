import { useRouter } from 'next/router';
import { useClient } from '@/app/api/clients';
import ClientPageContainer from '@/app/components/clients/ClientPageContainer';
import ClientTasksWidget from '@/app/components/clients/ClientTasksWidget';
import { Box, Grid, Group, Menu, Paper, Title, Text } from '@mantine/core';
import Avatar from '@/app/components/shared/Avatar';
import { formatPhoneNumber } from '@/core/utils';
import Link from '@/app/components/shared/Link';

export default function ClientPageTasks() {
  const router = useRouter();
  const query = router.query;
  const { data: client, isLoading } = useClient(query.id as string);

  return (
    <ClientPageContainer client={client} isLoading={isLoading}>
      <Paper
        p="xl"
        withBorder
        className="border-gray-600 border-opacity-20 shadow-sm"
      >
        <Box>
          <Grid>
            <Grid.Col span={3}>
              <Box>
                <Text color="brand" sx={{ fontWeight: 600 }}>
                  Email address:
                </Text>
                <Link href={`mailto:${client?.email}`}>{client?.email}</Link>
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box>
                <Text color="brand" sx={{ fontWeight: 600 }}>
                  Phone number:
                </Text>
                {client?.phone ? (
                  <Text>{formatPhoneNumber(client.phone)}</Text>
                ) : (
                  <Text>-</Text>
                )}
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box>
                <Text color="brand" sx={{ fontWeight: 600 }}>
                  Website:
                </Text>
                {client?.website ? (
                  // <Text>{client.website}</Text>
                  <Link href={client.website}>{client.website}</Link>
                ) : (
                  <Text>-</Text>
                )}
              </Box>
            </Grid.Col>
          </Grid>
          <Grid mt={20}>
            <Grid.Col span={3}>
              <Box>
                <Text color="brand" sx={{ fontWeight: 600 }}>
                  Company:
                </Text>
                {client?.company ? (
                  <Text>{client.company}</Text>
                ) : (
                  <Text>-</Text>
                )}
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box>
                <Text color="brand" sx={{ fontWeight: 600 }}>
                  Address:
                </Text>
                {client?.address ? (
                  <Text>{client.address}</Text>
                ) : (
                  <Text>-</Text>
                )}
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Paper>
    </ClientPageContainer>
  );
}
