import { Menu } from '@mantine/core';
import { useToggle } from 'react-use';
import { FiTrash2, FiEdit, FiFileText, FiCopy, FiLink } from 'react-icons/fi';
import { ProjectStatus } from '@/core/types';
import { useFormDeleteMutation } from '@/app/api/forms';
import DeleteModal from '@/app/components/shared/DeleteModal';
import Link from '../shared/Link';

interface Props {
  id: string;
  status?: ProjectStatus;
}

export default function FormActionMenu({ id, status }: Props) {
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);

  const handleDeleteForm = useFormDeleteMutation();

  const onDeleteForm = async () => {
    await handleDeleteForm.mutateAsync(id);
    toggleOpenDeleteDialog();
  };

  return (
    <>
      <Menu closeOnItemClick={false}>
        <Menu.Item
          component={Link}
          to={`/forms/${id}/edit`}
          icon={<FiEdit />}
          className="hover:bg-gray-500 hover:bg-opacity-20"
        >
          Edit
        </Menu.Item>
        <Menu.Item
          component={Link}
          to={`/forms/${id}/responses`}
          icon={<FiFileText />}
          className="hover:bg-gray-500 hover:bg-opacity-20"
        >
          Responses
        </Menu.Item>
        <Menu.Item icon={<FiCopy />} className="hover:bg-gray-500 hover:bg-opacity-20">
          Duplicate
        </Menu.Item>
        <Menu.Item icon={<FiLink />} className="hover:bg-gray-500 hover:bg-opacity-20">
          Copy link to share
        </Menu.Item>
        <Menu.Item icon={<FiTrash2 />} color="red" onClick={toggleOpenDeleteDialog}>
          Delete
        </Menu.Item>
      </Menu>

      <DeleteModal
        title="Form"
        opened={openDeleteDialog}
        onClose={toggleOpenDeleteDialog}
        isLoading={handleDeleteForm.isLoading}
        onDelete={onDeleteForm}
      />
    </>
  );
}
