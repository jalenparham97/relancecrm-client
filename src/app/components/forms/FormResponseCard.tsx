import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Group,
  Modal,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { IconTrash, IconArrowsDiagonal } from '@tabler/icons';
import { useResponseDeleteMutation } from '@/app/api/responses';
import { FormResponse } from '@/core/types';
import { formatDate } from '@/core/utils';
import { useColors, useDialog } from '@/app/hooks';
import DeleteModal from '../shared/DeleteModal';

interface Props {
  response: FormResponse;
}

export default function FormResponseCard({ response }: Props) {
  const colors = useColors();
  const [deleteModal, openDeleteModal, closeDeleteModal] = useDialog();
  const [expandOpen, openExpand, closeExpand] = useDialog();
  const [selectedId, setSelectedId] = useState('');

  const handleDeleteResponse = useResponseDeleteMutation(response?.formId);

  function openDeleteResponseModal() {
    setSelectedId(response._id);
    openDeleteModal();
  }

  async function onDeleteResponse() {
    try {
      await handleDeleteResponse.mutateAsync(selectedId);
      setSelectedId('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Paper
      p="md"
      withBorder
      className="border-gray-600 border-opacity-20 shadow-sm"
    >
      <Group position="apart">
        <Group spacing="xl">
          <Box>{formatDate(response.createdAt)}</Box>
          {typeof response.content[0].value === 'object' ? (
            <Text
              className="cursor-pointer hover:underline"
              onClick={openExpand}
            >
              {response.content[0].value[0]}
            </Text>
          ) : (
            <Text
              className="cursor-pointer hover:underline"
              onClick={openExpand}
            >
              {response.content[0].value}
            </Text>
          )}
        </Group>
        <Group spacing="xs">
          <ExpandActionButton
            response={response}
            opened={expandOpen}
            open={openExpand}
            onClose={closeExpand}
          />
          <ActionIcon variant="default" onClick={openDeleteResponseModal}>
            <IconTrash size={16} color={colors.red[5]} />
          </ActionIcon>
        </Group>
      </Group>

      <DeleteModal
        opened={deleteModal}
        onClose={closeDeleteModal}
        isLoading={handleDeleteResponse.isLoading}
        onDelete={onDeleteResponse}
        title="Response"
      />
    </Paper>
  );
}

interface ExpandActionButtonProps {
  response: FormResponse;
  opened: boolean;
  onClose: () => void;
  open: () => void;
}

function ExpandActionButton({
  response,
  opened,
  open,
  onClose,
}: ExpandActionButtonProps) {
  return (
    <>
      <ActionIcon variant="default" onClick={open}>
        <IconArrowsDiagonal size={16} />
      </ActionIcon>
      <Modal opened={opened} onClose={onClose} title="Response">
        <Box className="space-y-4">
          {response.content.map((item) => {
            const valueArray =
              typeof item.value === 'object' && (item.value as string[]);

            return (
              <Box>
                <Title order={5}>{item.element.label}</Title>
                {valueArray ? (
                  <Box>
                    {valueArray.map((value) => (
                      <Text>{value}</Text>
                    ))}
                  </Box>
                ) : (
                  <Text>{item.value}</Text>
                )}
              </Box>
            );
          })}
        </Box>
      </Modal>
    </>
  );
}
