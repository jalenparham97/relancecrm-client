import { useUser } from '@/api/auth';
import { useStripeConnectSession } from '@/api/payments';
import { useUserUpdateMutation } from '@/api/users';
import { Box, Title, Paper, Text, Tooltip, SimpleGrid } from '@mantine/core';
import { isEmpty } from 'lodash';
import { useToggle } from 'react-use';
import Link from '@/components/shared/Link';
import PaymentMethodCard from './PaymentMethodCard';
import PaymentMethodZelleConnectModal from './PaymentMethodZelleConnectModal';

export default function PaymentMethods() {
  const user = useUser();
  const [openZelleDialog, toggleOpenZelleDialog] = useToggle(false);
  const { initiate: handleStripeConnect, isLoading } = useStripeConnectSession();
  const handleUserUpdateSubmit = useUserUpdateMutation(user._id);

  const isStripeConnected = !isEmpty(user?.connectedPayments?.stripe?.accountId);
  const isZelleConnected = !isEmpty(user?.connectedPayments?.zelle?.accountId);

  return (
    <Paper padding="lg" shadow="xs" withBorder>
      <Title order={2}>Payment methods</Title>
      <Text className="mt-1">
        Setup any payments methods you'd like to make available for clients. Connected payment
        methods will appear as defaults for your future invoices.
      </Text>

      <Box className="mt-4">
        <SimpleGrid cols={2}>
          <PaymentMethodCard
            appName="stripe"
            appLogo="https://cdn.brandfolder.io/KGT2DTA4/at/8vbr8k4mr5xjwk4hxq4t9vs/Stripe_wordmark_-_blurple.svg"
            onConnect={handleStripeConnect}
            loading={isLoading}
            isConnected={isStripeConnected}
            toggleIsEnabled={handleUserUpdateSubmit.mutateAsync}
            dashboardUrl="https://dashboard.stripe.com"
          >
            {!isStripeConnected && (
              <Text className="text-sm">Accept credit cards, debit cards, and ACH.</Text>
            )}
            {isStripeConnected && <Text className="text-sm">Connected as {user.email}</Text>}
            <Text className="text-sm">
              2.9% + $0.30 fee.{' '}
              <Link
                className="text-sm"
                href="https://stripe.com/us/pricing"
                target="_blank"
                rel="noopener"
              >
                Learn more at Stripe.
              </Link>
            </Text>
          </PaymentMethodCard>
          <PaymentMethodCard
            appName="zelle"
            appLogo="/assets/logos/zelle-logo.svg"
            isConnected={isZelleConnected}
            onConnect={toggleOpenZelleDialog}
            toggleIsEnabled={handleUserUpdateSubmit.mutateAsync}
          >
            <Text className="text-sm">Zelle payments are processed outside of Relance.</Text>
            <Text className="text-sm">
              <Tooltip
                label="We do not track external transactions. For these types of payment options, please manually mark invoices as paid."
                classNames={{ body: 'w-60' }}
                withArrow
              >
                <Link className="text-sm">Learn what this means.</Link>
              </Tooltip>
            </Text>
          </PaymentMethodCard>
        </SimpleGrid>
      </Box>

      <PaymentMethodZelleConnectModal
        opened={openZelleDialog}
        onClose={toggleOpenZelleDialog}
        submit={handleUserUpdateSubmit.mutateAsync}
        isLoading={handleUserUpdateSubmit.isLoading}
      />
    </Paper>
  );
}
