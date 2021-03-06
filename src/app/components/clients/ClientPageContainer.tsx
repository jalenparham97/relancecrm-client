import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import {
  Box,
  Container,
  Loader,
  Paper,
  Group,
  Title,
  Text,
  Menu,
  Grid,
} from '@mantine/core';
import {
  useClientDeleteMutation,
  useClientUpdateMutation,
} from '@/app/api/clients';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatPhoneNumber } from '@/app/utils';
import { Client } from '@/core/types';
import PageLayout from '@/app/components/layouts/PageLayout';
import Button from '@/app/components/shared/Button';
import Avatar from '@/app/components/shared/Avatar';
import DeleteModal from '@/app/components/shared/DeleteModal';
import ClientEditModal from '@/app/components/clients/ClientEditModal';
import NavTabs from '@/app/components/shared/NavTabs';
import NavTab from '@/app/components/shared/NavTab';

interface Props {
  client: Client;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function ClientPageContainer({
  client,
  isLoading,
  children,
}: Props) {
  const router = useRouter();
  const query = router.query;
  const [openClientFormDialog, toggleOpenClientFormDialog] = useToggle(false);
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);

  const handleClientSubmit = useClientUpdateMutation(query.id as string);
  const handleDeleteClient = useClientDeleteMutation();

  const onDeleteClient = async () => {
    await handleDeleteClient.mutateAsync(query.id as string);
    if (!handleDeleteClient.isLoading) {
      router.push('/clients');
    }
  };

  return (
    <PageLayout>
      <Container size="xl">
        {isLoading && (
          <Box className="flex justify-center items-center h-[80vh]">
            <Loader />
          </Box>
        )}
        {!isLoading && (
          <>
            <Button
              className="hover:bg-transparent"
              variant="subtle"
              color="dark"
              leftIcon={<FiArrowLeft />}
              compact
              to="/clients"
            >
              Back to clients
            </Button>
            <Group position="apart" className="mt-6">
              <Group>
                <Avatar
                  radius="xl"
                  size="lg"
                  backgroundColor={client?.backgroundColor}
                >
                  {client?.initials}
                </Avatar>
                <Title order={2}>{client?.fullName}</Title>
              </Group>
              <Group>
                <Menu placement="end">
                  <Menu.Item
                    icon={<FiEdit2 />}
                    onClick={toggleOpenClientFormDialog}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    icon={<FiTrash2 />}
                    onClick={toggleOpenDeleteDialog}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              </Group>
            </Group>
            {/* <Paper
              mt={15}
              p="xl"
              withBorder
              className="border-gray-600 border-opacity-20 shadow-sm"
            >
              <Group position="apart">
                <Group>
                  <Avatar
                    radius="xl"
                    size="lg"
                    backgroundColor={client?.backgroundColor}
                  >
                    {client?.initials}
                  </Avatar>
                  <Title order={2}>{client?.fullName}</Title>
                </Group>
                <Group>
                  <Menu placement="end">
                    <Menu.Item
                      icon={<FiEdit2 />}
                      onClick={toggleOpenClientFormDialog}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      icon={<FiTrash2 />}
                      onClick={toggleOpenDeleteDialog}
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                </Group>
              </Group>

              <Box mt={20}>
                <Grid>
                  <Grid.Col span={3}>
                    <Box>
                      <Text color="brand" sx={{ fontWeight: 600 }}>
                        Email address:
                      </Text>
                      <Text>{client?.email}</Text>
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
                        <Text>{client.website}</Text>
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
            </Paper> */}

            <Box className="mt-8">
              <NavTabs className="">
                <NavTab to={`/clients/${query.id}`} label="Overview" />
                <NavTab to={`/clients/${query.id}/tasks`} label="Tasks" />
                <NavTab to={`/clients/${query.id}/projects`} label="Projects" />
                <NavTab to={`/clients/${query.id}/invoices`} label="Invoices" />
                <NavTab
                  to={`/clients/${query.id}/proposals`}
                  label="Proposals"
                />
              </NavTabs>

              <Box className="pt-5">{children}</Box>
            </Box>
          </>
        )}
      </Container>

      <ClientEditModal
        client={client}
        opened={openClientFormDialog}
        onClose={toggleOpenClientFormDialog}
        submit={handleClientSubmit.mutateAsync}
      />

      <DeleteModal
        opened={openDeleteDialog}
        onClose={toggleOpenDeleteDialog}
        isLoading={handleDeleteClient.isLoading}
        onDelete={onDeleteClient}
        title="Client"
      />
    </PageLayout>
  );
}
