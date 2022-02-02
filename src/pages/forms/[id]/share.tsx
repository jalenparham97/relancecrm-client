import { Box } from '@mantine/core';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import FormPageHeader from '@/app/components/forms/FormPageHeader';

export default function share() {
  return (
    <FormPageContainer header={<FormPageHeader />}>
      <Box>Share Page</Box>
    </FormPageContainer>
  );
}
