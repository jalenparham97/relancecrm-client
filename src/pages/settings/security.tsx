import { Box } from '@mantine/core';
import PageLayout from '@/components/layouts/PageLayout';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
import SecurityChangePassword from '@/components/settings/security/ChangePassword';

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
