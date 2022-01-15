import { Box } from '@mantine/core';
import PageLayout from '@/app/components/layouts/PageLayout';
import SettingsPageContainer from '@/app/components/settings/SettingsPageContainer';
import SecurityChangePassword from '@/app/components/settings/security/ChangePassword';

export default function Security() {
  return (
    <PageLayout>
      <SettingsPageContainer>
        <Box className="space-y-4">
          <SecurityChangePassword />
        </Box>
      </SettingsPageContainer>
    </PageLayout>
  );
}
