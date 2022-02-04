import React, { useEffect, useState } from 'react';
import { useToggle } from 'react-use';
import { useInputState } from '@mantine/hooks';
import { useIsDarkMode, useToasts } from '@/app/hooks';
import { ActionIcon, Box, Divider, Paper, TextInput, Title, Tooltip } from '@mantine/core';
import { FiImage, FiSave, FiX } from 'react-icons/fi';
import { useFormUpdateMutation } from '@/app/api/forms';
import { useRecoilState } from 'recoil';
import { formState } from '@/app/store';
import { Form } from '@/core/types';
import Button from '../shared/Button';

interface Props {
  form: Form;
}

export default function FormHeaderSection({}: Props) {
  const isDarkMode = useIsDarkMode();
  const [form, setForm] = useRecoilState(formState);
  const [editMode, toggleEditMode] = useToggle(false);
  const toasts = useToasts();

  const handleUpdateForm = useFormUpdateMutation(form?._id);

  const updateHeader = async () => {
    await handleUpdateForm.mutateAsync({ header: form?.header });
    toggleEditMode(false);
    toasts.success('Form updated');
  };

  const onFormHeaderChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      header: e.currentTarget.value,
    }));
  };

  return (
    <Paper
      padding={80}
      withBorder
      className={`relative border-gray-300 shadow-sm border-t-8 ${isDarkMode && 'border-gray-800'}`}
      sx={{ borderTopColor: `${form?.brandFillColor} !important` }}
    >
      <Box className="">
        {/* <Box className="flex justify-center items-center">
          <Box className="p-8 w-8 bg-indigo-600 rounded"></Box>
        </Box> */}
        <Button
          size="xs"
          variant={'default'}
          className={`absolute top-2 right-3`}
          leftIcon={<FiImage size="15px" />}
        >
          Add cover
        </Button>
        {!editMode && (
          <Title className="text-center" order={2} onClick={() => toggleEditMode(true)}>
            {form?.header}
          </Title>
        )}
        {editMode && (
          <TextInput
            value={form?.header}
            onChange={onFormHeaderChange}
            autoFocus
            rightSectionWidth={70}
            rightSection={
              <Box className="flex">
                <Tooltip label="Save" position="bottom">
                  <ActionIcon
                    variant="default"
                    onClick={updateHeader}
                    loading={handleUpdateForm.isLoading}
                  >
                    <FiSave />
                  </ActionIcon>
                </Tooltip>
                <ActionIcon variant="default" onClick={toggleEditMode} className="ml-1">
                  <FiX />
                </ActionIcon>
              </Box>
            }
          />
        )}
      </Box>
    </Paper>
  );
}
