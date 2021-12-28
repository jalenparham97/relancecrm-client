import { Box } from '@mantine/core';
import { useUser } from '@/api/auth';
import { useUserUpdateMutation } from '@/api/users';
import PageLayout from '@/components/layouts/PageLayout';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
import SecurityChangePassword from '@/components/settings/security/ChangePassword';

export default function Security() {
  const user = useUser();

  const handleUserUpdateSubmit = useUserUpdateMutation(user._id);

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
