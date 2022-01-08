import { useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';
import { Box, Paper, Title, Group } from '@mantine/core';
import { FiPlus } from 'react-icons/fi';
import { IoReceiptOutline } from 'react-icons/io5';
import { useUser } from '@/api/auth';
import { useInvoiceAddMutation, useInvoicesProject } from '@/api/invoices';
import { InvoicePaymentMethods, Project } from '@/types';
import { createInvoiceItem } from '@/store';
import EmptyState from '@/components/shared/EmptyState';
import LoadingLoader from '@/components/shared/LoadingLoader';
import Button from '@/components/shared/Button';
import ProjectInvoiceItem from './ProjectInvoiceItem';

interface Props {
  id?: string;
  project?: Project;
  [x: string]: any;
}

export default function ProjectInvoicesWidget({ id, project }: Props) {
  const user = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);
  const { isLoading, data: invoices } = useInvoicesProject(id);

  const handleInvoiceCreate = useInvoiceAddMutation();

  const createInvoice = async () => {
    try {
      const itemId = (() => nanoid())();
      const fromData = {
        fromName: user?.fullName,
        fromCompany: user?.businessInfo.businessName,
        fromAddress: user?.businessInfo.address,
      };
      const toData = {
        toName: project?.client?.fullName || '',
        toCompany: project?.client?.company || '',
        toAddress: project?.client?.address || '',
        toEmail: project?.client?.email || '',
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
        client: project?.client?._id,
        project: id,
        items: [createInvoiceItem(itemId)],
      });
      if (invoice) router.push(`/invoices/${invoice?._id}/edit`);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <Paper>
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
                    <ProjectInvoiceItem invoice={invoice} project={project} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {isEmpty(invoices?.data) && (
            <Box className="py-4">
              <EmptyState
                title="This project does not have any invoices"
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
    </Paper>
  );
}
