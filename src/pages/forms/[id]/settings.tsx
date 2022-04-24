import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFormUpdateMutation } from '@/app/api/forms';
import {
  Box,
  Container,
  Divider,
  Group,
  List,
  NumberInput,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons';
import { Form, FormStatus } from '@/core/types';
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

  const handleEmailNotificationChange = () => {
    setForm((prevForm) => ({
      ...prevForm,
      settings: {
        ...prevForm.settings,
        sendEmailNotification: !prevForm.settings?.sendEmailNotification,
      },
    }));
  };

  const handleResponsesLimitChange = () => {
    setForm((prevForm) => ({
      ...prevForm,
      settings: {
        ...prevForm.settings,
        limitResponses: !prevForm.settings?.limitResponses,
      },
    }));
  };
  const handleMaxResponsesChange = (maxResponses: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      settings: {
        ...prevForm.settings,
        maxResponses,
      },
    }));
  };

  const handleSettingsSave = async () => {
    try {
      if (form.settings.isClosed === true) {
        const update: Form = {
          settings: form.settings,
          status: FormStatus.CLOSED,
        };
        await handleUpdateFormSubmit.mutateAsync(update);
      } else {
        const update: Form = {
          settings: form.settings,
          status: FormStatus.OPEN,
        };
        await handleUpdateFormSubmit.mutateAsync(update);
      }
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
          <List.Item
            className="w-[700px] cursor-pointer"
            onClick={handleEmailNotificationChange}
          >
            <Divider />
            <Box className="py-3">
              <Box className="space-y-1">
                <Box className="flex items-center justify-between">
                  <Title order={5}>Email notifications</Title>
                  <Box>
                    <Switch checked={form?.settings?.sendEmailNotification} />
                  </Box>
                </Box>
                <Text className="text-sm text-gray-700">
                  Get an email for new form submissions.
                </Text>
              </Box>
            </Box>
            <Divider />
          </List.Item>
          <List.Item
            className="w-[700px] cursor-pointer"
            onClick={handleCloseForm}
          >
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
          <Box className="w-[700px]">
            <List.Item
              className="w-full cursor-pointer"
              onClick={handleResponsesLimitChange}
            >
              <Box className="py-3">
                <Box className="space-y-4">
                  <Box className="space-y-1">
                    <Box className="flex items-center justify-between">
                      <Title order={5}>Limit the number of responses</Title>
                      <Box>
                        <Switch checked={form?.settings?.limitResponses} />
                      </Box>
                    </Box>
                    <Text className="text-sm text-gray-700">
                      Set how many responses you want to receive in total.
                    </Text>
                  </Box>
                </Box>
              </Box>
            </List.Item>
            {form?.settings?.limitResponses && (
              <NumberInput
                placeholder="Max responses"
                className="pb-3"
                onChange={handleMaxResponsesChange}
                defaultValue={form?.settings?.maxResponses}
              />
            )}
            <Divider />
          </Box>
        </List>
        <Button
          leftIcon={<IconDeviceFloppy size={16} />}
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
