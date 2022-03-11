import { useRouter } from 'next/router';
import { Menu } from '@mantine/core';
import { useCopyToClipboard, useToggle } from 'react-use';
import { FiTrash2, FiEdit, FiFileText, FiCopy, FiLink } from 'react-icons/fi';
import { Form, ProjectStatus } from '@/core/types';
import { useForm, useFormAddMutation, useFormDeleteMutation } from '@/app/api/forms';
import { config } from '@/core/config';
import { useToasts } from '@/app/hooks';
import DeleteModal from '@/app/components/shared/DeleteModal';
import Link from '../shared/Link';
import { omitObjProperty } from '@/core/utils';

interface Props {
  id: string;
  status?: ProjectStatus;
}

export default function FormActionMenu({ id, status }: Props) {
  const router = useRouter();
  const toasts = useToasts();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false);
  const { data: form } = useForm(id);

  const handleDuplicateFormSubmit = useFormAddMutation();
  const handleDeleteForm = useFormDeleteMutation();

  const shareLink = `${config.publicWebAppURL}/forms/${id}/view`;

  const copyShareLink = () => {
    copyToClipboard(shareLink);
    toasts.success('Share link was copied!');
  };

  const onDeleteForm = async () => {
    await handleDeleteForm.mutateAsync(id);
    toggleOpenDeleteDialog(false);
  };

  const handleDuplicateForm = async () => {
    try {
      const exludedFields = ['userId', 'id', '_id', 'createdAt', 'updatedAt'];
      const duplicateForm: Form = {
        ...omitObjProperty(form, exludedFields),
        name: `Copy ${form?.name}`,
      };
      const newForm = await handleDuplicateFormSubmit.mutateAsync(duplicateForm);
      router.push(`/forms/${newForm._id}/edit`);
    } catch (error) {
      console.log(error);
    }
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
          to={`/forms/${id}`}
          icon={<FiFileText />}
          className="hover:bg-gray-500 hover:bg-opacity-20"
        >
          Responses
        </Menu.Item>
        <Menu.Item
          icon={<FiCopy />}
          className="hover:bg-gray-500 hover:bg-opacity-20"
          onClick={handleDuplicateForm}
          disabled={handleDuplicateFormSubmit.isLoading}
        >
          Duplicate
        </Menu.Item>
        <Menu.Item
          icon={<FiLink />}
          className="hover:bg-gray-500 hover:bg-opacity-20"
          onClick={copyShareLink}
        >
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
