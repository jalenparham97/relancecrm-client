import { Modal, Button, Group, ModalProps, Box, Text } from '@mantine/core';
import { useRouter } from 'next/router';

interface Props extends ModalProps {
  size?: string | number;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export default function ProposalApproveModal({
  opened,
  onClose,
  size,
  onSubmit,
  isLoading,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Mark as approved"
      styles={{ title: { fontSize: '25px', fontWeight: 'bold' } }}
      size={size}
    >
      <Group direction="column" grow>
        <Text>
          Are you sure you want to mark this proposal as approved? You will not
          be able to undo this action.
        </Text>

        <Box mt={15}>
          <Group spacing="sm" position="apart" grow>
            <Button variant="default" onClick={onClose}>
              No, nevermind
            </Button>
            <Button color="green" onClick={onSubmit} loading={isLoading}>
              Yes, approve it
            </Button>
          </Group>
        </Box>
      </Group>
    </Modal>
  );
}
