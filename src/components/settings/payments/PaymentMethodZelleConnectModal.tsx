import { Modal, Button, Group, ModalProps, Box, TextInput } from '@mantine/core';
import { User } from '@/types';
import { useUser } from '@/api/auth';
import { useInputState } from '@mantine/hooks';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: User) => Promise<void | User>;
}

export default function PaymentMethodZelleConnectModal({
  opened,
  onClose,
  submit,
  isLoading,
}: Props) {
  const user = useUser();
  const [zelleInfo, setZelleInfo] = useInputState('');

  const handleSubmit = async () => {
    if (zelleInfo !== '') {
      await submit({
        connectedPayments: {
          ...user.connectedPayments,
          zelle: { ...user?.connectedPayments['zelle'], accountId: zelleInfo, isEnabled: true },
        },
      });
      if (!isLoading) {
        onClose();
      }
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Zelle information">
      <Box className="flex flex-col space-y-3">
        <TextInput
          label="Email or phone number"
          placeholder="Zelle account email or phone number"
          defaultValue={user?.connectedPayments?.zelle?.accountId}
          onChange={setZelleInfo}
        />

        <Box mt={20}>
          <Group spacing="sm" position="right">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} onClick={handleSubmit}>
              Save
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
}
