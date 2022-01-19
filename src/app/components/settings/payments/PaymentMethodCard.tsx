import { Box, Checkbox, Group, LoadingOverlay, Menu, Paper, Text } from '@mantine/core';
import { useUser } from '@/app/api/auth';
import { PaymentTypes, User } from '@/core/types';
import { useToggle } from 'react-use';
import Button from '@/app/components/shared/Button';
import { capitalize } from 'lodash';
import Link from '@/app/components/shared/Link';

interface Props {
  appLogo?: string;
  appName?: PaymentTypes;
  isConnected?: boolean;
  onConnect?: () => Promise<any> | void;
  children?: React.ReactNode;
  loading?: boolean;
  toggleIsEnabled?: (data: User) => Promise<void | User>;
  dashboardUrl?: string;
}

export default function PaymentMethodCard({
  appLogo,
  appName,
  onConnect,
  children,
  isConnected,
  loading,
  toggleIsEnabled,
  dashboardUrl,
}: Props) {
  const user = useUser();
  const [openMenu, toggleOpenMenu] = useToggle(false);
  const isPaymentEnabled = user?.connectedPayments && user?.connectedPayments[appName]?.isEnabled;

  const handeTogglePaymentEnabled = async () => {
    if (isConnected) {
      await toggleIsEnabled({
        connectedPayments: {
          ...user?.connectedPayments,
          [appName]: { ...user?.connectedPayments[appName], isEnabled: !isPaymentEnabled },
        },
      });
    }
  };

  return (
    <Paper
      padding="md"
      withBorder
      className={`relative border-gray-600 ${!isPaymentEnabled && 'border-opacity-30'} ${
        isPaymentEnabled && 'border-indigo-500 border-opacity-60'
      }`}
    >
      <LoadingOverlay visible={loading} />
      <Box className="space-y-3">
        <Group position="apart" align="center">
          <Checkbox
            checked={isPaymentEnabled}
            disabled={!isConnected}
            onClick={handeTogglePaymentEnabled}
          />
          <Menu>
            <Menu.Item onClick={onConnect}>Change linked account</Menu.Item>
            <Menu.Item>Unlink account</Menu.Item>
          </Menu>
        </Group>
        <Box className="space-y-4">
          <Box className="flex flex-col justify-center items-center text-center">
            <img src={appLogo} alt={`${appName} logo`} className="w-[100px] h-12 -ml-2" />
            <Box className="ml-[3px] pb-2">{children}</Box>
          </Box>
          <Box>
            {!isConnected && (
              <Button fullWidth variant="default" onClick={onConnect}>
                Connect {capitalize(appName)}
              </Button>
            )}
            {isConnected && appName !== 'zelle' && (
              <Link className="hover:no-underline" href={dashboardUrl}>
                <Button variant="light" fullWidth>
                  View {capitalize(appName)} Dashboard
                </Button>
              </Link>
            )}
            {isConnected && appName === 'zelle' && (
              <Paper padding="xs" className="border-gray-600 border-opacity-30">
                <Text className="text-sm leading-none text-center">
                  Zelle account: {user?.connectedPayments.zelle.accountId}
                </Text>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
