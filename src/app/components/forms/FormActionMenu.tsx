import { useRouter } from 'next/router';
import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useCopyToClipboard } from 'react-use';
import {
  IconTrash,
  IconEdit,
  IconCopy,
  IconLink,
  IconInbox,
  IconSettings,
} from '@tabler/icons';
import { Form, ProjectStatus } from '@/core/types';
import {
  useForm,
  useFormAddMutation,
  useFormDeleteMutation,
} from '@/app/api/forms';
import { config } from '@/core/config';
import { useDialog, useToasts } from '@/app/hooks';
import { omitObjProperty } from '@/core/utils';
import DeleteModal from '@/app/components/shared/DeleteModal';

interface Props {
  id: string;
  status?: ProjectStatus;
}

export default function FormActionMenu({ id, status }: Props) {
  const router = useRouter();
  const toasts = useToasts();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [deleteDialog, openDeleteDialog, closeDeleteDialog] = useDialog();
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
    closeDeleteDialog();
  };

  const handleDuplicateForm = async () => {
    try {
      const exludedFields = [
        'userId',
        'id',
        '_id',
        'createdAt',
        'updatedAt',
        'responsesCount',
      ];
      const duplicateForm: Form = {
        ...omitObjProperty(form, exludedFields),
        name: `Copy ${form?.name}`,
      };
      const newForm = await handleDuplicateFormSubmit.mutateAsync(
        duplicateForm
      );
      router.push(`/forms/${newForm._id}/edit`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menu closeOnItemClick={false}>
        <Menu.Item
          component={NextLink}
          href={`/forms/${id}/edit`}
          icon={<IconEdit size={16} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          component={NextLink}
          href={`/forms/${id}`}
          icon={<IconInbox size={16} />}
        >
          Responses
        </Menu.Item>
        <Menu.Item
          component={NextLink}
          href={`/forms/${id}/settings`}
          icon={<IconSettings size={16} />}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          icon={<IconCopy size={16} />}
          onClick={handleDuplicateForm}
          disabled={handleDuplicateFormSubmit.isLoading}
        >
          Duplicate
        </Menu.Item>
        <Menu.Item icon={<IconLink size={16} />} onClick={copyShareLink}>
          Copy link to share
        </Menu.Item>
        <Menu.Item
          icon={<IconTrash size={16} />}
          color="red"
          onClick={openDeleteDialog}
        >
          Delete
        </Menu.Item>
      </Menu>

      <DeleteModal
        title="Form"
        opened={deleteDialog}
        onClose={closeDeleteDialog}
        isLoading={handleDeleteForm.isLoading}
        onDelete={onDeleteForm}
      />
    </>
  );
}
