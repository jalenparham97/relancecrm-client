import { useRouter } from 'next/router';
import { useForm } from '@/app/api/forms';
import { Title } from '@mantine/core';
import Button from '@/app/components/shared/Button';
import FormPageContainer from '@/app/components/forms/FormPageContainer';

export default function index() {
  const { query } = useRouter();
  const { isLoading, data: form } = useForm(query.id as string);

  return (
    <FormPageContainer form={form} isLoading={isLoading}>
      <Title order={3}>Responses</Title>
    </FormPageContainer>
  );
}
