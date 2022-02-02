import { Modal, Button, ModalProps, Box, Divider, Title, Text } from '@mantine/core';
import { Form } from '@/core/types';
import { useIsDarkMode } from '@/app/hooks';
import { useToggle } from 'react-use';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: Form) => Promise<Form>;
}

export default function FormPreviewModal({ opened, onClose, submit }: Props) {
  const isDarkMode = useIsDarkMode();

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
    <Modal opened={opened} onClose={handleFormClose} title="Basic Client Onboarding" size="lg">
      <Box>
        <Text>Form Preview</Text>
      </Box>
    </Modal>
  );
}
