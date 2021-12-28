import { useUser } from '@/api/auth';
import { useUserUpdateMutation } from '@/api/users';
import PageLayout from '@/components/layouts/PageLayout';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
import Billing from '@/components/settings/billing/Billing';

export default function BillingSettings() {
  const user = useUser();

  const handleUserUpdateSubmit = useUserUpdateMutation(user._id);

  return (
    <PageLayout>
      <SettingsPageContainer>
        <Billing />
      </SettingsPageContainer>
    </PageLayout>
  );
}
