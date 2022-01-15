import { Box } from '@mantine/core';
import PageLayout from '@/app/components/layouts/PageLayout';
import SettingsPageContainer from '@/app/components/settings/SettingsPageContainer';
import Billing from '@/app/components/settings/billing/Billing';

export default function BillingSettings() {
  return (
    <PageLayout>
      <SettingsPageContainer>
        <Box className="space-y-4">
          <Billing />
        </Box>
      </SettingsPageContainer>
    </PageLayout>
  );
}
