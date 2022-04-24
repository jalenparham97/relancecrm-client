import { useRouter } from 'next/router';
import { isEqual } from 'lodash';
import { useForm, useFormUpdateMutation } from '@/app/api/forms';
import {
  ActionIcon,
  Box,
  Header,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconDeviceFloppy,
  IconInbox,
  IconSend,
  IconX,
  IconArrowLeft,
} from '@tabler/icons';
import { useDialog } from '@/app/hooks';
import { useRecoilState } from 'recoil';
import { formState } from '@/app/store';
import { useToggle } from 'react-use';
import NavButton from '../shared/NavButton';
import UnsavedDataModal from '@/app/components/shared/UnsavedDataModal';

export default function FormPageHeader() {
  const [form, setForm] = useRecoilState(formState);
  const { query, back } = useRouter();
  const { data: formData } = useForm(query.id as string);
  const [unsavedModal, openUnsavedModal, closeUnsavedModal] = useDialog();
  const [editMode, toggleEditMode] = useToggle(false);

  const handleUpdateForm = useFormUpdateMutation(form?._id);

  const updateFormName = async () => {
    await handleUpdateForm.mutateAsync({ name: form?.name });
    toggleEditMode(false);
  };

  const onFormNameChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      name: e.currentTarget.value,
    }));
  };

  const handleBack = () => {
    if (isEqual(formData, form)) {
      back();
    } else {
      openUnsavedModal();
    }
  };

  return (
    <Header
      height={70}
      p="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Box className="flex items-center space-x-5">
          <ActionIcon size="lg" onClick={handleBack}>
            <IconArrowLeft size="20px" />
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
                      <IconDeviceFloppy size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <ActionIcon
                    variant="default"
                    onClick={toggleEditMode}
                    className="ml-1"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Box>
              }
            />
          )}
        </Box>
        <Box className="flex items-center space-x-3">
          <NavButton
            to={`/forms/${query.id}/share`}
            leftIcon={<IconSend size={14} />}
          >
            Share
          </NavButton>
          <NavButton
            to={`/forms/${query.id}`}
            leftIcon={<IconInbox size={16} />}
          >
            Responses
          </NavButton>
        </Box>
      </Box>

      <UnsavedDataModal opened={unsavedModal} onClose={closeUnsavedModal} />
    </Header>
  );
}
