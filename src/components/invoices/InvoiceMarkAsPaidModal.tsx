import { Modal, Button, Group, ModalProps, Box, Text } from '@mantine/core';
import { useIsDarkMode, useColors } from '@/hooks';

interface Props extends ModalProps {
  isLoading?: boolean;
  onSubmit?: () => Promise<void>;
}

export default function InvoiceMarkAsPaidModal({ opened, onClose, onSubmit, isLoading }: Props) {
  const isDarkMode = useIsDarkMode();
  const colors = useColors();

  const handleSubmit = async () => {
    try {
      await onSubmit();
      if (!isLoading) {
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Mark invoice as paid">
      <Group direction="column" grow>
        <Box>
          <Text>Are you sure you want to mark this invoice as paid?</Text>
          <Text>You will not be able to undo this action.</Text>
        </Box>

        <Box mt={15}>
          <Group spacing="sm" position="right">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={isLoading} onClick={handleSubmit}>
              Mark as paid
            </Button>
          </Group>
        </Box>
      </Group>
    </Modal>
  );
}
