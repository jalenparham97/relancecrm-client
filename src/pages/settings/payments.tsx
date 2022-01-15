import { Box } from '@mantine/core';
import PageLayout from '@/app/components/layouts/PageLayout';
import SettingsPageContainer from '@/app/components/settings/SettingsPageContainer';
import PaymentMethods from '@/app/components/settings/payments/PaymentMethods';

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
