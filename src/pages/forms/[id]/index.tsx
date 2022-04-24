import { useLocation } from 'react-use';
import { useForm } from '@/app/api/forms';
import { useResponses } from '@/app/api/responses';
import { Box, Title, Stack, Group } from '@mantine/core';
import { isEmpty } from 'lodash';
import { IconInbox } from '@tabler/icons';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';
import EmptyState from '@/app/components/shared/EmptyState';
import FormResponseCard from '@/app/components/forms/FormResponseCard';

export default function index() {
  const location = useLocation();
  const formId = location.pathname?.split('/')[2];
  const { isLoading, data: form } = useForm(formId);
  const { isLoading: responsesLoading, data: responses } = useResponses(formId);

  return (
    <FormPageContainer form={form} isLoading={isLoading}>
      {responsesLoading && <LoadingLoader height="50vh" />}

      {!responsesLoading && (
        <>
          {!isEmpty(responses.data) && (
            <Box className="space-y-3">
              <Group spacing="xs">
                <Title order={3}>Responses</Title>
                <Title order={5}>({responses.total})</Title>
              </Group>
              {!isEmpty(form) && (
                <Stack spacing="xs">
                  {responses?.data.map((response) => (
                    <FormResponseCard response={response} />
                  ))}
                </Stack>
              )}
            </Box>
          )}
          {isEmpty(responses.data) && (
            <Box className="py-4">
              <EmptyState
                title="No completed submissions yet"
                subtitle="Share your form with the world to start receiving submittions."
                icon={<IconInbox size="50px" />}
                actionButton={
                  <Button to={`/forms/${formId}/share`}>Share</Button>
                }
              />
            </Box>
          )}
        </>
      )}
    </FormPageContainer>
  );
}
