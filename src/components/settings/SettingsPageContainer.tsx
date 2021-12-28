import { useUser } from '@/api/auth';
import { Box, Container, Grid, Col, Paper, Title } from '@mantine/core';
import { isSupportedCountry } from 'libphonenumber-js';
import { isEmpty } from 'lodash';
import { FiCreditCard, FiDollarSign, FiLock, FiUser } from 'react-icons/fi';
import LoadingLoader from '../shared/LoadingLoader';
import SettingsNavListItem from './SettingsNavListItem';

interface Props {
  children: React.ReactNode;
}

export default function SettingsPageContainer({ children }: Props) {
  const user = useUser();

  return (
    <Container size="xl">
      {isEmpty(user) && <LoadingLoader />}

      {!isEmpty(user) && (
        <Box className="space-y-2">
          <Title order={1}>Settings</Title>

          <Grid gutter="lg">
            <Col span={3}>
              <Paper padding="lg" shadow="sm" withBorder>
                <Box className="flex flex-col space-y-1">
                  <SettingsNavListItem text="Account" href="/settings/account" icon={<FiUser />} />
                  <SettingsNavListItem
                    text="Security"
                    href="/settings/security"
                    icon={<FiLock />}
                  />
                  <SettingsNavListItem
                    text="Billing"
                    href="/settings/billing"
                    icon={<FiCreditCard />}
                  />
                  <SettingsNavListItem
                    text="Payments"
                    href="/settings/payments"
                    icon={<FiDollarSign />}
                  />
                </Box>
              </Paper>
            </Col>
            <Col span={9}>
              <Box>{children}</Box>
            </Col>
          </Grid>
        </Box>
      )}
    </Container>
  );
}
