import { useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';
import { Box, Title, Group } from '@mantine/core';
import { useUser } from '@/app/api/auth';
import { InvoicePaymentMethods, Project } from '@/core/types';
import { createInvoiceItem, DefaultProposal } from '@/app/store';
import {
  useProposalAddMutation,
  useProposalsProject,
} from '@/app/api/proposals';
import { IconFileDescription, IconPlus } from '@tabler/icons';
import EmptyState from '@/app/components/shared/EmptyState';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import Button from '@/app/components/shared/Button';

interface Props {
  id?: string;
  project?: Project;
  [x: string]: any;
}

export default function ProjectProposalsWidget({ id, project }: Props) {
  const user = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);
  const { isLoading, data: proposals } = useProposalsProject(id);

  const handleProposalCreate = useProposalAddMutation();

  const createProposal = async () => {
    try {
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
      const proposal = await handleProposalCreate.mutateAsync({
        ...DefaultProposal,
        ...fromData,
        ...toData,
        project: project?._id,
      });
      if (proposal) router.push(`/proposals/${proposal?._id}/edit`);
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
          {!isEmpty(proposals?.data) && (
            <Box>
              <Group position="apart">
                <Title order={2}>Proposals</Title>
                <Button
                  leftIcon={<IconPlus size={16} />}
                  onClick={createProposal}
                  loading={handleProposalCreate.isLoading}
                >
                  Add proposal
                </Button>
              </Group>
              <Box className="mt-4 space-y-3">
                {proposals?.data.map((invoice) => (
                  <Box key={invoice._id}>
                    {/* <ProjectInvoiceItem invoice={invoice} project={project} /> */}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {isEmpty(proposals?.data) && (
            <Box className="py-4">
              <EmptyState
                title="This project does not have any proposals"
                icon={<IconFileDescription size={50} />}
                actionButton={
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    onClick={createProposal}
                    loading={handleProposalCreate.isLoading}
                  >
                    Add proposal
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
