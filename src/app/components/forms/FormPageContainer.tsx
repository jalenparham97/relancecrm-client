import { useRouter } from 'next/router';
import { Box, Container, Group, Title } from '@mantine/core';
import { FiEdit } from 'react-icons/fi';
import { Form } from '@/core/types';
import PageLayout from '@/app/components/layouts/PageLayout';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';
import NavTab from '@/app/components/shared/NavTab';
import NavTabs from '@/app/components/shared/NavTabs';

interface Props {
  form: Form;
  isLoading: boolean;
  children?: React.ReactNode;
}

export default function FormPageContainer({ form, isLoading, children }: Props) {
  const { query } = useRouter();

  return (
    <PageLayout>
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Container size="xl">
          <Box className="flex justify-between items-center">
            <Title order={1}>{form?.name}</Title>
            <Group spacing="xs">
              <Button to={`/forms/${query.id}/edit`} leftIcon={<FiEdit />}>
                Edit
              </Button>
            </Group>
          </Box>

          <Box className="mt-8">
            <NavTabs className="">
              <NavTab to={`/forms/${query.id}`} label="Responses" />
              <NavTab to={`/forms/${query.id}/share`} label="Share" />
              <NavTab to={`/forms/${query.id}/settings`} label="Settings" />
            </NavTabs>

            <Box className="pt-5">{children}</Box>
          </Box>
        </Container>
      )}
    </PageLayout>
  );
}
