import { useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';
import { Box, Title, Group } from '@mantine/core';
import { FiPlus } from 'react-icons/fi';
import { IoReceiptOutline } from 'react-icons/io5';
import { useUser } from '@/app/api/auth';
import { useInvoiceAddMutation, useInvoicesClient } from '@/app/api/invoices';
import { Client, InvoicePaymentMethods } from '@/core/types';
import { createInvoiceItem } from '@/app/store';
import EmptyState from '@/app/components/shared/EmptyState';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';
import InvoiceItem from '@/app/components/invoices/InvoiceItem';

interface Props {
  id?: string;
  client?: Client;
  [x: string]: any;
}

export default function ClientInvoicesWidget({ id, client }: Props) {
  const user = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);
  const { isLoading, data: invoices } = useInvoicesClient(id);

  const handleInvoiceCreate = useInvoiceAddMutation();

  const createInvoice = async () => {
    try {
      const itemId = (() => nanoid())();
      const fromData = {
        fromName: user?.fullName,
        fromCompany: user?.businessInfo?.businessName || '',
        fromAddress: user?.businessInfo?.address || '',
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
      const invoice = await handleInvoiceCreate.mutateAsync({
        ...fromData,
        ...toData,
        paymentMethods,
        client: client._id,
        items: [createInvoiceItem(itemId)],
      });
      if (invoice) router.push(`/invoices/${invoice?._id}/edit`);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <Box>
      {isLoading && <LoadingLoader height="100%" />}
      {!isLoading && (
        <Box>
          {!isEmpty(invoices?.data) && (
            <Box>
              <Group position="apart">
                <Title order={2}>Invoices</Title>
                <Button
                  leftIcon={<FiPlus />}
                  onClick={createInvoice}
                  loading={handleInvoiceCreate.isLoading}
                >
                  Add invoice
                </Button>
              </Group>
              <Box className="mt-4 space-y-3">
                {invoices?.data.map((invoice) => (
                  <Box key={invoice._id}>
                    <InvoiceItem invoice={invoice} client={client} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {isEmpty(invoices?.data) && (
            <Box className="py-4">
              <EmptyState
                title="This client does not have any invoices"
                icon={<IoReceiptOutline size="50px" />}
                actionButton={
                  <Button
                    leftIcon={<FiPlus />}
                    onClick={createInvoice}
                    loading={handleInvoiceCreate.isLoading}
                  >
                    Add invoice
                  </Button>
                }
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
