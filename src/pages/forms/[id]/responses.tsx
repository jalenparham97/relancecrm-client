import { Box } from '@mantine/core';
import FormEditPageContainer from '@/app/components/forms/FormEditPageContainer';
import FormPageHeader from '@/app/components/forms/FormPageHeader';

export default function repspones() {
  return (
    <FormEditPageContainer header={<FormPageHeader />}>
      <Box>Repspones Page</Box>
    </FormEditPageContainer>
  );
}
