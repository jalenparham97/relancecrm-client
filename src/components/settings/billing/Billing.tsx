import { Box, Paper, PasswordInput, SimpleGrid, Text, TextInput, Title } from '@mantine/core';
import { useBillingPortalSession } from '@/api/payments';
import Button from '@/components/shared/Button';

export default function Billing() {
  const { initiate, isLoading } = useBillingPortalSession();

  return (
    <Paper padding="lg" shadow="sm" withBorder>
      <Title order={2}>Billing subscription</Title>
      <Text className="mt-1">
        View and edit your billing details, as well as update your subscription.
      </Text>

      <Box className="mt-3 space-y-5">
        <Text>You are currently on the Pro plan.</Text>
        <Button loading={isLoading} onClick={initiate}>
          Go to the billing portal
        </Button>
      </Box>
    </Paper>
  );
}
