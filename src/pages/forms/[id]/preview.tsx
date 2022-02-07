import { useRouter } from 'next/router';
import { Box, Container } from '@mantine/core';
import { useForm } from '@/app/api/forms';
import FormPreviewPageContainer from '@/app/components/forms/FormPreviewPageContainer';
import FormPreview from '@/app/components/forms/FormPreview';
import LoadingLoader from '@/app/components/shared/LoadingLoader';

export default function preview() {
  const { query } = useRouter();
  const { data: form, isLoading } = useForm(query.id as string);

  console.log({ form });

  return (
    <FormPreviewPageContainer>
      {isLoading && <LoadingLoader height="90vh" color="blue" />}
      {!isLoading && (
        <Container size="sm" className="pt-5">
          <FormPreview form={form} isPreview />
        </Container>
      )}
    </FormPreviewPageContainer>
  );
}
