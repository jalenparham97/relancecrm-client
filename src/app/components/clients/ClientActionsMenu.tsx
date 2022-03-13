import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useToggle } from 'react-use';
import { IconTrash, IconEdit } from '@tabler/icons';
import { useClientDeleteMutation } from '@/app/api/clients';
import DeleteModal from '@/app/components/shared/DeleteModal';

interface Props {
  id?: string;
}

export default function ClientActionsMenu({ id }: Props) {
  const [openDeleteModal, toggleOpenDeleteModal] = useToggle(false);

  const handleDelete = useClientDeleteMutation();

  const onDelete = async () => {
    await handleDelete.mutateAsync(id);
    toggleOpenDeleteModal();
  };

  return (
    <>
      <Menu>
        <Menu.Item component={NextLink} href={`/clients/${id}`} icon={<IconEdit size={16} />}>
          Edit
        </Menu.Item>
        <Menu.Item icon={<IconTrash size={16} />} color="red" onClick={toggleOpenDeleteModal}>
          Delete
        </Menu.Item>
      </Menu>

      <DeleteModal
        title="Client"
        size="md"
        opened={openDeleteModal}
        onClose={toggleOpenDeleteModal}
        onDelete={onDelete}
        isLoading={handleDelete.isLoading}
      />
    </>
  );
}
