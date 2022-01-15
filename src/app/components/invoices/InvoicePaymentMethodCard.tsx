import { Paper, Box, Group, Checkbox } from '@mantine/core';
import { useUser } from '@/app/api/auth';
import { PaymentTypes, InvoicePaymentMethods } from '@/core/types';
import { useColors } from '@/app/hooks';

interface Props {
  logo?: string;
  appName?: PaymentTypes;
  children?: React.ReactNode;
  connected?: boolean;
  paymentMethods?: InvoicePaymentMethods;
  onUpdate?: React.Dispatch<React.SetStateAction<InvoicePaymentMethods>>;
  isPaymentMethodEnabled?: boolean;
}

export default function InvoicePaymentMethodCard({
  logo,
  appName,
  children,
  paymentMethods,
  onUpdate,
  isPaymentMethodEnabled = false,
}: Props) {
  const user = useUser();
  const colors = useColors();
  const isConnected = (paymentMethods && paymentMethods[appName]?.connected) || false;

  const handleUpdate = () => {
    onUpdate((prev) => ({
      ...prev,
      [appName]: {
        connected: !isConnected,
        accountId: user?.connectedPayments?.[appName]?.accountId || '',
      },
    }));
  };

  return (
    <Paper
      padding={5}
      withBorder
      className={`border-gray-600 ${!isConnected && 'border-opacity-30'} ${
        isConnected && 'border-indigo-500 border-opacity-60'
      }`}
    >
      <Group position="apart" align="center">
        <Group spacing="xs">
          <img src={logo} alt="" style={{ width: '90px', height: '50px' }} />
          <Box>{children}</Box>
        </Group>
        <Box className="pr-2">
          <Checkbox
            checked={isConnected}
            onClick={handleUpdate}
            disabled={!isPaymentMethodEnabled}
          />
        </Box>
      </Group>
    </Paper>
  );
}
