import { useYupResolver } from '@/app/hooks';
import {
  Modal,
  Button,
  Group,
  ModalProps,
  Box,
  TextInput,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().trim().required('Please enter your name'),
});

interface Props extends ModalProps {
  size?: string | number;
  onSubmitApprove?: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ProposalClientAcceptModal({
  opened,
  onClose,
  size,
  onSubmitApprove,
  isLoading,
}: Props) {
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ name: string }>({ resolver });

  const onSubmit = async ({ name }: { name: string }) => {
    await onSubmitApprove(name);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Accept Proposal"
      styles={{ title: { fontSize: '25px', fontWeight: 'bold' } }}
      size={size}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group direction="column" grow>
          <TextInput
            required
            label="Please enter your name"
            placeholder="Your name"
            {...register('name')}
            error={errors?.name?.message}
            data-autofocus
          />

          <Box mt={10}>
            <Group spacing="sm" position="right">
              <Button variant="default" onClick={handleClose}>
                Close
              </Button>
              <Button color="green" type="submit" loading={isSubmitting}>
                Accept
              </Button>
            </Group>
          </Box>
        </Group>
      </form>
    </Modal>
  );
}
