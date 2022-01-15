import { Box } from '@mantine/core';
import { useUser } from '@/app/api/auth';
import { useUserUpdateMutation } from '@/app/api/users';
import PageLayout from '@/app/components/layouts/PageLayout';
import SettingsPageContainer from '@/app/components/settings/SettingsPageContainer';
import AccountProfile from '@/app/components/settings/account/AccountProfile';
import AccountBusinessInfo from '@/app/components/settings/account/AccountBusinessInfo';

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
