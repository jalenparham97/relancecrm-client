import { Modal, Button, Group, ModalProps, Box, Text } from '@mantine/core';

interface Props extends ModalProps {
  size?: string | number;
  onSubmit?: () => void;
  isLoading?: boolean;
  title?: string;
}

export default function ArchiveModal({
  opened,
  onClose,
  size,
  onSubmit,
  isLoading,
  title,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Archive ${title}`}
      styles={{ title: { fontSize: '25px', fontWeight: 'bold' } }}
      size={size}
    >
      <Group direction="column" grow>
        <Text>
          Are you sure you want to archive this {title.toLowerCase()}? You will
          still have access to the archived proposal and can unarchive it at any
          time.
        </Text>

        <Box mt={15}>
          <Group spacing="sm" position="apart" grow>
            <Button variant="default" onClick={onClose}>
              No, nevermind
            </Button>
            <Button color="dark" onClick={onSubmit} loading={isLoading}>
              Yes, archive it
            </Button>
          </Group>
        </Box>
      </Group>
    </Modal>
  );
}
