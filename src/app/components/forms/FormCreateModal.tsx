import {
  Modal,
  Button,
  Group,
  ModalProps,
  Box,
  TextInput,
  SimpleGrid,
  Divider,
  Title,
  Tabs,
} from '@mantine/core';
import { Form } from '@/core/types';
import { useDialog, useIsDarkMode } from '@/app/hooks';
import { useToggle } from 'react-use';
import FormPreviewModal from './FormPreviewModal';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: Form) => Promise<Form>;
}

export default function FormCreateModal({ opened, onClose, submit }: Props) {
  const isDarkMode = useIsDarkMode();
  const [previewOpen, openPreview, closePreview] = useDialog();

  const handleFormClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: Form) => {
    try {
      await submit({ ...data });
      handleFormClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal opened={opened} onClose={handleFormClose} title="Create a new form" size={1000}>
      <Divider />
      <Box className="py-4 flex justify-between items-center">
        <Title order={3}>Browse templates</Title>
        <Button onClick={openPreview}>Start from scratch</Button>
      </Box>
      <Box>
        <Tabs
          classNames={{ tabActive: '!bg-gray-600 !bg-opacity-20' }}
          variant="pills"
          tabPadding="xl"
        >
          <Tabs.Tab label="All">Gallery tab content</Tabs.Tab>
          <Tabs.Tab label="By Relance">Settings tab content</Tabs.Tab>
          <Tabs.Tab label="Your saved templates">Messages tab content</Tabs.Tab>
        </Tabs>
      </Box>

      <FormPreviewModal opened={previewOpen} onClose={closePreview} />
    </Modal>
  );
}
