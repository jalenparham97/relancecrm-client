import { Box } from '@mantine/core';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import FormPageHeader from '@/app/components/forms/FormPageHeader';

export default function repspones() {
  return (
    <FormPageContainer header={<FormPageHeader />}>
      <Box>Repspones Page</Box>
    </FormPageContainer>
  );
}
