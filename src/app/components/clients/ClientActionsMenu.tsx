import { Menu } from '@mantine/core';
import { useToggle } from 'react-use';
// import { useCandidateDeleteMutation } from '@/api/candidates';
import { Client } from '@/core/types';
import DeleteModal from '@/app/components/shared/DeleteModal';
import { useClientDeleteMutation } from '@/app/api/clients';

interface Props {
  client?: Client;
}

export default function ClientActionsMenu({ client }: Props) {
  const [openDeleteModal, toggleOpenDeleteModal] = useToggle(false);

  const handleDelete = useClientDeleteMutation();

  const onDelete = async () => {
    await handleDelete.mutateAsync(client?._id);
    toggleOpenDeleteModal();
  };

  return (
    <>
      <Menu>
        <Menu.Item>Edit client</Menu.Item>
        <Menu.Item color="red" onClick={toggleOpenDeleteModal}>
          Delete client
        </Menu.Item>
      </Menu>

      <DeleteModal
        title="Candidate"
        size="md"
        opened={openDeleteModal}
        onClose={toggleOpenDeleteModal}
        onDelete={onDelete}
        isLoading={handleDelete.isLoading}
      />
    </>
  );
}
