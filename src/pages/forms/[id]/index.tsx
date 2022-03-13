import { useState } from 'react';
import { useLocation } from 'react-use';
import { useForm } from '@/app/api/forms';
import { useResponseDeleteMutation, useResponses } from '@/app/api/responses';
import { Box, Title, Table, Paper, ActionIcon, Modal, Text } from '@mantine/core';
import { isEmpty } from 'lodash';
import { IconTrash, IconInbox, IconArrowsDiagonal } from '@tabler/icons';
import { useDialog, useColors } from '@/app/hooks';
import { FormResponse } from '@/core/types';
import { formatDate } from '@/core/utils';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import DeleteModal from '@/app/components/shared/DeleteModal';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';
import EmptyState from '@/app/components/shared/EmptyState';

export default function index() {
  const colors = useColors();
  const location = useLocation();
  const formId = location.pathname?.split('/')[2];
  const [deleteModal, openDeleteModal, closeDeleteModal] = useDialog();
  const { isLoading, data: form } = useForm(formId);
  const [selectedId, setSelectedId] = useState('');
  const { isLoading: responsesLoading, data: responses } = useResponses(formId);

  const handleDeleteResponse = useResponseDeleteMutation();

  function openDeleteResponseModal(id: string) {
    setSelectedId(id);
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
    <FormPageContainer form={form} isLoading={isLoading}>
      {responsesLoading && <LoadingLoader height="50vh" />}

      {!responsesLoading && (
        <>
          {!isEmpty(responses.data) && (
            <Box className="space-y-3">
              <Title order={3}>Responses</Title>
              {!isEmpty(form) && (
                <Paper withBorder className="p-0 border-gray-600 border-opacity-20 shadow-sm">
                  <Table highlightOnHover verticalSpacing="xs">
                    <thead>
                      <tr>
                        {form?.content.map((item) => (
                          <th className="!p-4">{item.label}</th>
                        ))}
                        <th className="!p-4">Submitted at</th>
                        <th className="!p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses?.data.map((response) => {
                        return (
                          <tr key={response._id}>
                            {response.content.map((item) => (
                              <td className="!px-4">{item.value}</td>
                            ))}
                            <td className="!px-4">{formatDate(response.createdAt)}</td>
                            <td className="!px-4">
                              <Box className="flex space-x-1">
                                <ExpandActionButton response={response} />
                                <ActionIcon
                                  variant="default"
                                  onClick={() => openDeleteResponseModal(response._id)}
                                >
                                  <IconTrash size={16} color={colors.red[6]} />
                                </ActionIcon>
                              </Box>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Paper>
              )}

              <DeleteModal
                opened={deleteModal}
                onClose={closeDeleteModal}
                isLoading={handleDeleteResponse.isLoading}
                onDelete={onDeleteResponse}
                title="Response"
              />
            </Box>
          )}
          {isEmpty(responses.data) && (
            <Box className="py-4">
              <EmptyState
                title="No completed submissions yet"
                subtitle="Share your form with the world to start receiving submittions."
                icon={<IconInbox size="50px" />}
                actionButton={<Button to={`/forms/${formId}/share`}>Share</Button>}
              />
            </Box>
          )}
        </>
      )}
    </FormPageContainer>
  );
}

interface ExpandActionButtonProps {
  response: FormResponse;
}
function ExpandActionButton({ response }: ExpandActionButtonProps) {
  const [expandOpen, openExpand, closeExpand] = useDialog();

  return (
    <>
      <ActionIcon variant="default" onClick={openExpand}>
        <IconArrowsDiagonal size={16} />
      </ActionIcon>
      <Modal opened={expandOpen} onClose={closeExpand} title="Response" size="xl">
        <Box className="space-y-4">
          {response.content.map((item) => (
            <Box>
              <Title order={4}>{item.element.label}</Title>
              <Text>{item.value}</Text>
            </Box>
          ))}
        </Box>
      </Modal>
    </>
  );
}
