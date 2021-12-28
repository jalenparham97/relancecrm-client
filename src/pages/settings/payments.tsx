import { useUser } from '@/api/auth';
import { useUserUpdateMutation } from '@/api/users';
import PageLayout from '@/components/layouts/PageLayout';
import PaymentMethods from '@/components/settings/payments/PaymentMethods';
import SettingsPageContainer from '@/components/settings/SettingsPageContainer';
// import SettingsAccountForm from '@/components/settings/account/SettingsAccountForm';
// import SettingsPageShell from '@/components/settings/SettingsPageShell';

export default function Payments() {
  const user = useUser();

  const handleUserUpdateSubmit = useUserUpdateMutation(user._id);

  return (
    <PageLayout>
      <SettingsPageContainer>
        <PaymentMethods />
      </SettingsPageContainer>
    </PageLayout>
  );
}
