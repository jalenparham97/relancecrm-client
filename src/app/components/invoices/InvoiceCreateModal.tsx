import { Modal, Button, Group, ModalProps, Box } from '@mantine/core';
import { useUser } from '@/app/api/auth';
import { Client, CreateInvoice, Invoice, InvoicePaymentMethods } from '@/core/types';
import { useToggle } from 'react-use';
import { createInvoiceItem } from '@/app/store/defaultData';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useClients } from '@/app/api/clients';
import { useState } from 'react';
import ClientPicker from '@/app/components/clients/ClientPicker';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (data: CreateInvoice) => Promise<Invoice>;
}

export default function InvoiceCreateModal({ opened, onClose, submit, isLoading }: Props) {
  const user = useUser();
  const { push: navigate } = useRouter();
  // const { data: clients } = useClients();
  const [showClientPicker, toggleShowClientPicker] = useToggle(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientRequiredError, setClientRequiredError] = useState(false);
  const [client, setClient] = useState<Client>();

  const handleFormClose = () => {
    onClose();
    setClient(null);
    setClientRequiredError(false);
  };

  const handleInvoiceSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (client) {
      try {
        const itemId = (() => nanoid())();
        console.log({ user });
        const fromData = {
          fromName: user?.fullName,
          fromCompany: user?.businessInfo.businessName,
          fromAddress: user?.businessInfo.address,
        };
        const toData = {
          toName: client.fullName,
          toCompany: client.company,
          toAddress: client.address,
          toEmail: client.email,
        };
        const paymentMethods: InvoicePaymentMethods = {
          stripe: {
            connected: user?.connectedPayments?.stripe?.isEnabled || false,
            accountId: user?.connectedPayments?.stripe?.accountId || '',
          },
          zelle: {
            connected: user?.connectedPayments?.zelle?.isEnabled || false,
            accountId: user?.connectedPayments?.zelle?.accountId || '',
          },
        };
        const invoice = await submit({
          ...fromData,
          ...toData,
          paymentMethods,
          client: client._id,
          items: [createInvoiceItem(itemId)],
        });
        if (!isLoading) {
          handleFormClose();
          navigate(`/invoices/${invoice?._id}/edit`);
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setClientRequiredError(true);
    }
  };

  const handleSkipInvoiceSubmit = async () => {
    try {
      setIsSkipLoading(true);
      const itemId = (() => nanoid())();
      const fromData = {
        fromName: user?.fullName,
        fromCompany: user?.businessInfo.businessName,
        fromAddress: user?.businessInfo.address,
      };
      const paymentMethods: InvoicePaymentMethods = {
        stripe: {
          connected: user?.connectedPayments?.stripe?.isEnabled || false,
          accountId: user?.connectedPayments?.stripe?.accountId || '',
        },
        zelle: {
          connected: user?.connectedPayments?.zelle?.isEnabled || false,
          accountId: user?.connectedPayments?.zelle?.accountId || '',
        },
      };
      const invoice = await submit({
        ...fromData,
        paymentMethods,
        items: [createInvoiceItem(itemId)],
      });
      if (invoice) {
        setIsSkipLoading(false);
        handleFormClose();
        navigate(`/invoices/${invoice?._id}/edit`);
      }
    } catch (error) {
      setError(error.message);
      setIsSkipLoading(false);
    }
  };

  const addClient = (client: Client) => {
    setClient(client);
    toggleShowClientPicker(false);
  };

  return (
    <Modal opened={opened} onClose={handleFormClose} title="Create a new invoice" size="lg">
      <form onSubmit={handleInvoiceSubmit}>
        {/* {clients && <ClientPicker clients={clients?.data} setClient={addClient} />} */}

        <Box mt={20}>
          <Group position="apart" align="center">
            <Button variant="default" onClick={handleSkipInvoiceSubmit} loading={isSkipLoading}>
              Skip for now
            </Button>
            <Group spacing="sm">
              <Button variant="default" onClick={handleFormClose}>
                Cancel
              </Button>
              <Button loading={isLoading} type="submit">
                Save & continue
              </Button>
            </Group>
          </Group>
        </Box>
      </form>
    </Modal>
  );
}
