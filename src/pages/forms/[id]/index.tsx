import { useLocation } from 'react-use';
import { useForm } from '@/app/api/forms';
import { useResponses } from '@/app/api/responses';
import { Box, Title, Table, Paper, ActionIcon, Modal, Text } from '@mantine/core';
import { isEmpty } from 'lodash';
import { FiMaximize2, FiTrash2 } from 'react-icons/fi';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import { useDialog } from '@/app/hooks';
import { FormResponse } from '@/core/types';
import { formatDate } from '@/core/utils';

export default function index() {
  const location = useLocation();
  const formId = location.pathname?.split('/')[2];
  const { isLoading, data: form } = useForm(formId);
  const { isLoading: responsesLoading, data: responses } = useResponses(formId);

  return (
    <FormPageContainer form={form} isLoading={isLoading}>
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
                          <ActionIcon variant="default">
                            <FiTrash2 className="text-red-500" />
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
      </Box>
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
        <FiMaximize2 />
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
