import { useRouter } from 'next/router';
import { isEqual } from 'lodash';
import { useForm, useFormUpdateMutation } from '@/app/api/forms';
import { ActionIcon, Box, Header, TextInput, Title, Tooltip } from '@mantine/core';
import { FiArrowLeft, FiEdit2, FiFileText, FiSend, FiSave, FiX } from 'react-icons/fi';
import { useDialog, useToasts } from '@/app/hooks';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formState } from '@/app/store';
import NavButton from '../shared/NavButton';
import UnsavedDataModal from '@/app/components/shared/UnsavedDataModal';
import { useInputState } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { useToggle } from 'react-use';

export default function FormPageHeader() {
  const toasts = useToasts();
  const [form, setForm] = useRecoilState(formState);
  const { query, push } = useRouter();
  const { data: formData } = useForm(query.id as string);
  const [unsavedModal, openUnsavedModal, closeUnsavedModal] = useDialog();
  const [editMode, toggleEditMode] = useToggle(false);

  const handleUpdateForm = useFormUpdateMutation(form?._id);

  const updateFormName = async () => {
    await handleUpdateForm.mutateAsync({ name: form?.name });
    toggleEditMode(false);
    toasts.success('Form updated');
  };

  const onFormNameChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      name: e.currentTarget.value,
    }));
  };

  const handleBack = () => {
    if (isEqual(formData, form)) {
      push('/forms');
    } else {
      openUnsavedModal();
    }
  };

  return (
    <Header
      height={70}
      padding="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Box className="flex items-center space-x-5">
          <ActionIcon size="lg" onClick={handleBack}>
            <FiArrowLeft size="20px" />
          </ActionIcon>

          {!editMode && (
            <Title order={2} onClick={() => toggleEditMode(true)}>
              {form?.name}
            </Title>
          )}
          {editMode && (
            <TextInput
              value={form?.name}
              onChange={onFormNameChange}
              autoFocus
              className="w-64"
              rightSectionWidth={70}
              rightSection={
                <Box className="flex">
                  <Tooltip label="Save" position="bottom">
                    <ActionIcon
                      variant="default"
                      onClick={updateFormName}
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
        <Box className="flex items-center space-x-3">
          <NavButton to={`/forms/${query.id}/edit`} leftIcon={<FiEdit2 />}>
            Create
          </NavButton>
          <NavButton to={`/forms/${query.id}/share`} leftIcon={<FiSend />}>
            Share
          </NavButton>
          <NavButton to={`/forms/${query.id}/responses`} leftIcon={<FiFileText />}>
            Responses
          </NavButton>
        </Box>
      </Box>

      <UnsavedDataModal opened={unsavedModal} onClose={closeUnsavedModal} />
    </Header>
  );
}
