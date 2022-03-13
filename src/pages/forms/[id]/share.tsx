import { useRouter } from 'next/router';
import { Box, TextInput, Title, Text } from '@mantine/core';
import { config } from '@/core/config';
import { useForm } from '@/app/api/forms';
import { useCopyToClipboard } from 'react-use';
import { useToasts } from '@/app/hooks';
import { IconCopy } from '@tabler/icons';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import Button from '@/app/components/shared/Button';

export default function share() {
  const { query } = useRouter();
  const toasts = useToasts();
  const [_, copyToClipboard] = useCopyToClipboard();
  const { isLoading, data: form } = useForm(query.id as string);

  const shareLink = `${config.publicWebAppURL}/forms/${query.id}/view`;

  const copyShareLink = () => {
    copyToClipboard(shareLink);
    toasts.success('Share link was copied!');
  };

  return (
    <FormPageContainer form={form} isLoading={isLoading}>
      <Box className="space-y-3">
        <Box className="space-y-1">
          <Title order={3}>Share link</Title>
          <Text className="w-[500px]">
            Your form is now ready to be shared. Copy this link to share your form on messaging
            apps, social media, or via email.
          </Text>
        </Box>
        <TextInput
          className="w-[350px]"
          value={shareLink}
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
        />
        <Button onClick={copyShareLink} leftIcon={<IconCopy size={16} />}>
          Copy
        </Button>
      </Box>
    </FormPageContainer>
  );
}
