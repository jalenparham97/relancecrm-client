import { Modal, Button, Group, ModalProps, Box, Text, Divider } from '@mantine/core';
import { Client, Invoice } from '@/types';
import { useToggle } from 'react-use';
import { useState } from 'react';
import { useClients } from '@/api/clients';
import { useRecoilState } from 'recoil';
import { createInvoiceState } from '@/store';
import { isEmpty } from 'lodash';
import { FiPlus } from 'react-icons/fi';
import { useInvoice } from '@/api/invoices';
import { useRouter } from 'next/router';
import ClientPicker from '../clients/ClientPicker';
import InvoiceRecipientItem from './InvoiceRecipientItem';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: () => Promise<void>;
}

export default function InvoiceRecipientModal({ opened, onClose, submit, isLoading }: Props) {
  const { query } = useRouter();
  const { data: clients } = useClients();
  const { data: invoiceData } = useInvoice(query.id as string);
  const [showClientPicker, toggleShowClientPicker] = useToggle(false);
  const [showRecipientPicker, toggleShowRecipientPicker] = useToggle(false);
  const [invoice, setInvoice] = useRecoilState(createInvoiceState);
  const [recipients, setRecipients] = useState<Client[]>([]);

  const invoiceClient = clients?.data.find((client) => client.email === invoice?.toEmail);

  console.log({ invoiceClient });

  const handleClose = () => {
    toggleShowClientPicker(false);
    toggleShowRecipientPicker(false);
    setInvoice(invoiceData);
    onClose();
  };

  const addClient = (client: Client) => {
    if (client) {
      setInvoice(
        (prevState) =>
          ({
            ...prevState,
            toName: client.fullName,
            toEmail: client.email,
            toCompany: client.company,
            toAddress: client.address,
            client: client._id,
          } as Invoice)
      );
      toggleShowClientPicker(false);
    }
  };

  const handleSubmit = async () => {
    await submit();
    toggleShowRecipientPicker(false);
    onClose();
  };

  const addRecipient = (recipient: Client) => {
    if (recipient) {
      const updatedRecipients = [
        ...invoice.recipients,
        clients.data.find((client) => client._id === recipient._id),
      ];
      setRecipients(updatedRecipients);
      setInvoice((prev) => ({ ...prev, recipients: updatedRecipients }));
      toggleShowRecipientPicker();
    }
  };

  const removeRecipient = (recipient: Client) => {
    const updatedRecipients = recipients.filter((client) => client._id !== recipient._id);
    setRecipients(updatedRecipients);
    setInvoice((prev) => ({ ...prev, recipients: updatedRecipients }));
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Recipients" size="lg">
      <Box className="space-y-2">
        <Text className="font-semibold text-sm">Client</Text>
        {invoiceClient && !showClientPicker ? (
          <InvoiceRecipientItem client={invoiceClient} onCancel={toggleShowClientPicker} />
        ) : (
          <ClientPicker label="" clients={clients?.data} setClient={addClient} />
        )}
      </Box>

      {!isEmpty(invoice?.recipients) && (
        <Box className="mt-3 space-y-2">
          <Text className="font-semibold text-sm">Additional recipients</Text>
          {invoice.recipients.map((recipient) => (
            <Box key={recipient._id}>
              <InvoiceRecipientItem
                client={recipient}
                onCancel={() => removeRecipient(recipient)}
              />
            </Box>
          ))}
        </Box>
      )}

      <Box className="mt-3">
        <Divider />
        <Box className="mt-4">
          {showRecipientPicker ? (
            <Box>
              <Text className="font-semibold text-sm">Add a recipient</Text>
              <Box className="mt-2">
                <ClientPicker label="" clients={clients?.data} setClient={addRecipient} />
              </Box>
            </Box>
          ) : (
            <Button variant="default" leftIcon={<FiPlus />} onClick={toggleShowRecipientPicker}>
              Add recipients
            </Button>
          )}
        </Box>
      </Box>

      <Box mt={20}>
        <Group spacing="sm" position="right">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit}>
            Save
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
