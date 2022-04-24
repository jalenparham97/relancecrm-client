import { useUser } from '@/app/api/auth';
import { Box, Container, Title } from '@mantine/core';
import { isEmpty } from 'lodash';
import LoadingLoader from '../shared/LoadingLoader';
import NavTab from '../shared/NavTab';
import NavTabs from '../shared/NavTabs';

interface Props {
  children: React.ReactNode;
}

export default function SettingsPageContainer({ children }: Props) {
  const user = useUser();

  return (
    <Container size="xl">
      {isEmpty(user) && <LoadingLoader />}

      {!isEmpty(user) && (
        <Box className="space-y-8">
          <Title order={1}>Settings</Title>

          <NavTabs>
            <NavTab to="/settings/account" label="Account" />
            <NavTab to="/settings/security" label="Security" />
            <NavTab to="/settings/billing" label="Billing" />
            <NavTab to="/settings/payments" label="Payments" />
          </NavTabs>

          <Box className="pt-2">{children}</Box>
        </Box>
      )}
    </Container>
  );
}
