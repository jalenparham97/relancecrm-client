import { useCreateCheckoutSession } from '@/app/api/payments';
import { Box, Center, Title, Text, Divider, List, Card, Paper } from '@mantine/core';
import { FiCheckCircle } from 'react-icons/fi';
import PageShellBasic from '@/app/components/layouts/PageShellBasic';
import Link from '@/app/components/shared/Link';
import Button from '@/app/components/shared/Button';

export default function Subscribe() {
  const { initiateCheckoutSession, isLoading } = useCreateCheckoutSession();

  return (
    <PageShellBasic>
      <Center>
        <Box className="space-y-6">
          <a
            href="https://relancecrm.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Title order={3} className="text-center pt-14 pb-2">
              Relance CRM
            </Title>
          </a>
          <Text className="text-center text-4xl md:text-5xl lg:text-6xl">
            Your free trial has ended
          </Text>
          <Text className="text-center md:text-lg">
            Your trial is over. Please select a plan to continue using Relance
          </Text>
          <Center>
            <Paper className="w-full md:w-1/2 lg:w-1/2 px-3" shadow="sm">
              <Box className="pt-8 pb-8 px-4">
                <Box className="text-center">
                  <Text className="text-4xl font-bold font-heading">Pro</Text>
                  <Text className="text-4xl text-indigo-600 font-bold font-heading">$12</Text>
                  <Text className="mb-8 font-medium">per month</Text>
                </Box>
                <Divider className="" />
                <List
                  className="mb-8 mt-8 text-blueGray-600 text-base text-center"
                  spacing="xs"
                  size="sm"
                  center
                  icon={<FiCheckCircle size="20px" className="text-green-600" />}
                >
                  <List.Item>
                    <Text>Unlimited clients</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Unlimited invoices</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Task management</Text>
                  </List.Item>
                </List>
                <Box className="text-center">
                  <Button fullWidth size="lg" onClick={initiateCheckoutSession} loading={isLoading}>
                    Subscribe
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Center>
        </Box>
      </Center>
    </PageShellBasic>
  );
}
