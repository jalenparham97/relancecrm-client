import { Box } from '@mantine/core';
import PageLayout from '@/components/layouts/PageLayout';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
import Billing from '@/components/settings/billing/Billing';

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
