import { Box } from '@mantine/core';
import { useUser } from '@/api/auth';
import { useUserUpdateMutation } from '@/api/users';
import PageLayout from '@/components/layouts/PageLayout';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
import AccountProfile from '@/components/settings/account/AccountProfile';
import AccountBusinessInfo from '@/components/settings/account/AccountBusinessInfo';

export default function Account() {
  const user = useUser();

  const handleUserUpdateSubmit = useUserUpdateMutation(user._id);

  return (
    <PageLayout>
      <SettingsPageContainer>
        <Box className="space-y-4">
          <AccountProfile user={user} submit={handleUserUpdateSubmit.mutateAsync} />
          <AccountBusinessInfo user={user} submit={handleUserUpdateSubmit.mutateAsync} />
        </Box>
      </SettingsPageContainer>
    </PageLayout>
  );
}
