import { Modal, Button, Group, ModalProps, Box, Text, ActionIcon, Tooltip } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { useCopyToClipboard } from 'react-use';

interface Props extends ModalProps {
  size?: string | number;
  accountId: string;
}

export default function InvoiceZellePayModal({ opened, onClose, size, accountId }: Props) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const notifications = useNotifications();

  const copyAccountId = () => {
    copyToClipboard(accountId);
    notifications.showNotification({
      title: 'Success',
      message: 'Zelle account info copied!',
      color: 'green',
      icon: <FiCheck />,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <img
          src="/assets/logos/zelle-logo.svg"
          alt=""
          style={{ width: '80px', height: '40px', marginLeft: '-10px' }}
        />
      }
      size={size}
    >
      <Group direction="column" spacing="xs" grow>
        <Text>Pay this invoice via Zelle outside of Relance.</Text>

        <Group position="apart" align="center">
          <Box>
            <Text className="font-semibold">Account info</Text>
            <Text color="dimmed">{accountId}</Text>
          </Box>
          <Tooltip label="Copy account info">
            <ActionIcon variant="default" size="lg" onClick={copyAccountId}>
              <FiCopy />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Box className="mt-4 flex justify-end">
          <Button leftIcon={<FiCheck />} onClick={onClose}>
            OK
          </Button>
        </Box>
      </Group>
    </Modal>
  );
}
