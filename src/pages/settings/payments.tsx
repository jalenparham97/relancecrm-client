import { Box } from '@mantine/core';
import PageLayout from '@/components/layouts/PageLayout';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
import PaymentMethods from '@/components/settings/payments/PaymentMethods';

export default function PaymentSettings() {
  return (
    <PageLayout>
      <SettingsPageContainer>
        <Box className="space-y-4">
          <PaymentMethods />
        </Box>
      </SettingsPageContainer>
    </PageLayout>
  );
}
