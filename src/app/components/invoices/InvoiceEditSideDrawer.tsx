import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Navbar, Title, Group, ActionIcon, Badge } from '@mantine/core';
import { FiPlus, FiX } from 'react-icons/fi';
import Button from '@/app/components/shared/Button';
import { useInvoiceRemoveProjectMutation, useInvoiceUpdateMutation } from '@/app/api/invoices';
import { useDialog } from '@/app/hooks';
import { Client, Project } from '@/core/types';
import InvoiceProjectPickerModal from './InvoiceProjectPickerModal';
import { useRecoilValue } from 'recoil';
import { createInvoiceState } from '@/app/store';
import Avatar from '@/app/components/shared/Avatar';
import InvoiceRecipientModal from './InvoiceRecipientModal';
import InvoiceRecipientItem from './InvoiceRecipientItem';
import InvoicePaymentsModal from './InvoicePaymentsModal';

interface Props {
  drawerWidth?: number;
  updateInvoiceSubmit?: () => Promise<void>;
  updateLoading?: boolean;
}

export default function InvoiceEditSideDrawer({
  drawerWidth = 350,
  updateInvoiceSubmit,
  updateLoading,
}: Props) {
  const { query } = useRouter();
  const invoice = useRecoilValue(createInvoiceState);
  const [projectPicker, openProjectPicker, closeProjectPicker] = useDialog();
  const [recipientModal, openRecipientModal, closeRecipientModal] = useDialog();
  const [paymentsModal, openPaymentsModal, closePaymentsModal] = useDialog();
  const [project, setProject] = useState<Project>({});

  const handleUpdateInvoiceSubmit = useInvoiceUpdateMutation(query.id as string);
  const handleRemoveInvoiceProjectSubmit = useInvoiceRemoveProjectMutation(query.id as string);

  const updateInvoice = async () => {
    try {
      await updateInvoiceSubmit();
    } catch (error) {
      console.log(error);
    }
  };

  const saveProjectToInvoice = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({ project: project._id });
      closeProjectPicker();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProjectFromInvoice = async () => {
    try {
      await handleRemoveInvoiceProjectSubmit.mutateAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const removeRecipient = async (recipient: Client) => {
    try {
      const updatedRecipients = invoice.recipients.filter((client) => client._id !== recipient._id);
      await handleUpdateInvoiceSubmit.mutateAsync({ recipients: updatedRecipients });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
      className="border-l border-gray-500 border-opacity-20"
      padding="lg"
      width={{ base: drawerWidth }}
      fixed
      position={{ top: 0, right: 0 }}
    >
      <Box className="pt-[75px]">
        <Group direction="column" spacing="lg" grow>
          <Title order={2}>Settings</Title>
          <Box className="space-y-3">
            <Title order={4}>Connected Project</Title>
            {invoice?.project && (
              <Group position="apart">
                <Group noWrap spacing="xs">
                  <Avatar size={30} backgroundColor={invoice?.project.backgroundColor} radius="xl">
                    {invoice?.project.initials}
                  </Avatar>

                  <Box>
                    <Text>{invoice?.project.projectName}</Text>
                  </Box>
                </Group>
                <ActionIcon onClick={deleteProjectFromInvoice}>
                  <FiX />
                </ActionIcon>
              </Group>
            )}
            {!invoice?.project && (
              <Button
                fullWidth
                variant="default"
                leftIcon={<FiPlus size="16px" />}
                onClick={openProjectPicker}
              >
                Add invoice to a project
              </Button>
            )}
          </Box>
          <Box className="space-y-3">
            <Title order={4}>Recipients</Title>
            {invoice?.recipients?.map((recipient) => (
              <InvoiceRecipientItem
                key={recipient._id}
                client={recipient}
                showEmail={false}
                onCancel={() => removeRecipient(recipient)}
              />
            ))}
            <Button
              fullWidth
              variant="default"
              leftIcon={<FiPlus size="16px" />}
              onClick={openRecipientModal}
            >
              Add additional recipients
            </Button>
          </Box>
          <Box className="space-y-2">
            <Title order={4}>Payment Methods</Title>
            <Group>
              {invoice?.paymentMethods?.stripe?.connected && (
                <Badge size="lg" className="bg-[#635bff] text-white">
                  Stripe
                </Badge>
              )}
              {invoice?.paymentMethods?.paypal?.connected && <Badge size="lg">Paypal</Badge>}
              {invoice?.paymentMethods?.zelle?.connected && (
                <Badge size="lg" className="bg-[#6d1ed4] text-white">
                  Zelle
                </Badge>
              )}
            </Group>
            <Button
              fullWidth
              variant="default"
              leftIcon={<FiPlus size="16px" />}
              onClick={openPaymentsModal}
            >
              Update payment methods
            </Button>
          </Box>
        </Group>
      </Box>

      <InvoiceProjectPickerModal
        opened={projectPicker}
        onClose={closeProjectPicker}
        setProject={setProject}
        submit={saveProjectToInvoice}
        isLoading={handleUpdateInvoiceSubmit.isLoading}
      />

      <InvoiceRecipientModal
        opened={recipientModal}
        onClose={closeRecipientModal}
        submit={updateInvoice}
        isLoading={updateLoading}
      />

      <InvoicePaymentsModal opened={paymentsModal} onClose={closePaymentsModal} />
    </Navbar>
  );
}
