import { useRouter } from 'next/router';
import { Modal, Button, Group, ModalProps, Box, Text } from '@mantine/core';

interface Props extends ModalProps {
  size?: string | number;
}

export default function UnsavedDataModal({ opened, onClose, size }: Props) {
  const router = useRouter();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="You have unsaved changes?"
      styles={{ title: { fontSize: '25px', fontWeight: 'bold' } }}
      size={size}
    >
      <Group direction="column" grow>
        <Text>
          It looks like you made some changes. Are you sure you want to leave
          and discard them?
        </Text>

        <Box mt={15}>
          <Group spacing="sm" position="apart" grow>
            <Button variant="default" onClick={onClose}>
              No, nevermind
            </Button>
            <Button color="red" onClick={() => router.back()}>
              Yes, leave
            </Button>
          </Group>
        </Box>
      </Group>
    </Modal>
  );
}
