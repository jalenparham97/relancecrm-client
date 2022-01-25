import { Alert, Box, Paper, Text, Title } from '@mantine/core';
import { useBillingPortalSession } from '@/app/api/payments';
import { useUser } from '@/app/api/auth';
import Button from '@/app/components/shared/Button';
import dayjs from 'dayjs';
import { formatDate } from '@/app/utils';
import { FiInfo } from 'react-icons/fi';

export default function Billing() {
  const user = useUser();
  const { initiate, isLoading } = useBillingPortalSession();

  return (
    <Paper padding="lg" withBorder className="border-gray-600 border-opacity-20 shadow-sm">
      <Title order={2}>Billing subscription</Title>
      <Box className="space-y-5">
        <Text className="mt-1">
          View and edit your billing details, as well as update your subscription.
        </Text>

        <Text className="mt-1 font-medium text-lg">
          You are currently on the{' '}
          <span className="font-medium text-indigo-500">{user?.subscription.plan}</span> plan.
        </Text>

        {dayjs().isBefore(user?.subscription?.trialEndDate) && (
          <Alert
            icon={<FiInfo size={16} />}
            title={`You're on a free trial that ends on ${formatDate(
              user?.subscription?.trialEndDate
            )}.`}
            color="blue"
          >
            <Text>
              To continue to be on the {user?.subscription.plan} plan please add a payment method
              anytime before your trial is up.
            </Text>
            <Text>If you have already added a payment method you can disregard this message.</Text>
          </Alert>
        )}

        <Box className="mt-3">
          <Button loading={isLoading} onClick={initiate}>
            Go to the billing portal
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
