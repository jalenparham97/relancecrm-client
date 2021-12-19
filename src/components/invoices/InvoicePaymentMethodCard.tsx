import { Paper, Box, Group, Checkbox } from '@mantine/core';
import { useUser } from '@/api/auth';
import { PaymentTypes, InvoicePaymentMethods } from '@/types';
import { useColors } from '@/hooks';

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
    <Paper padding={5} withBorder sx={{ borderColor: isConnected ? colors.indigo[5] : '' }}>
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
