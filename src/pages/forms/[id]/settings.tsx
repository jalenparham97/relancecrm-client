import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFormUpdateMutation } from '@/app/api/forms';
import {
  Box,
  Container,
  Divider,
  Group,
  List,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { FiSave, FiTrash2 } from 'react-icons/fi';
import { Form } from '@/core/types';
import { isEqual } from 'lodash';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import Button from '@/app/components/shared/Button';

export default function settings() {
  const { query } = useRouter();
  const { isLoading, data: formData } = useForm(query.id as string);
  const [form, setForm] = useState<Form>({});

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  const handleUpdateFormSubmit = useFormUpdateMutation(query.id as string);

  const handleCloseForm = () => {
    setForm((prevForm) => ({
      ...prevForm,
      settings: { ...prevForm.settings, isClosed: !prevForm.settings.isClosed },
    }));
  };

  const handleSettingsSave = async () => {
    try {
      await handleUpdateFormSubmit.mutateAsync({ settings: form.settings });
    } catch (error) {
      console.log(error);
    }
  };

  console.log({ form });

  return (
    <FormPageContainer form={formData} isLoading={isLoading}>
      <Box className="w-[700px] flex items-center justify-between">
        <Title order={3}>Settings</Title>
      </Box>
      <Box className="mt-6 space-y-5">
        <List listStyleType="none">
          <List.Item className="w-[700px] cursor-pointer" onClick={handleCloseForm}>
            <Divider />
            <Box className="py-3">
              <Box className="space-y-1">
                <Box className="flex items-center justify-between">
                  <Title order={5}>Close form</Title>
                  <Box>
                    <Switch checked={form?.settings?.isClosed} />
                  </Box>
                </Box>
                <Text className="text-sm text-gray-700">
                  People won't be able to respond to this form anymore.
                </Text>
              </Box>
            </Box>
            <Divider />
          </List.Item>
        </List>
        <Button
          leftIcon={<FiSave />}
          disabled={isEqual(formData, form)}
          onClick={handleSettingsSave}
          loading={handleUpdateFormSubmit.isLoading}
        >
          Save changes
        </Button>
      </Box>
    </FormPageContainer>
  );
}
