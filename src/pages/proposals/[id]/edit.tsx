import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { Box, Container, Aside } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { CreateProposal, ProposalStatus } from '@/core/types';
import { useProposal, useProposalUpdateMutation } from '@/app/api/proposals';
import { proposalState } from '@/app/store';
import { getProposalTotalAmount } from '@/app/utils';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import ProposalEditHeader from '@/app/components/proposals/ProposalEditHeader';
import ProposalEditPageContainer from '@/app/components/proposals/ProposalEditPageContainer';
import ProposalEditSideDrawer from '@/app/components/proposals/ProposalEditSideDrawer';
import ProposalEditForm from '@/app/components/proposals/ProposalEditForm';
import ProposalPreview from '@/app/components/proposals/ProposalPreview';

const drawerWidth = 370;

export default function ProposalEditPage() {
  const { query, push } = useRouter();
  const { data: proposalData, isLoading } = useProposal(query.id as string);
  const [openPreview, toggleOpenPreview] = useToggle(false);
  const [proposal, setProposal] = useRecoilState(proposalState);

  useEffect(() => {
    setProposal(proposalData);
    // eslint-disable-next-line react-@/hooks/exhaustive-deps
  }, [proposalData]);

  const handleUpdateProposalSubmit = useProposalUpdateMutation(
    query.id as string
  );

  const updateProposal = async () => {
    const estimateBlock = proposal.content.find(
      (block) => block.type === 'estimate'
    );
    try {
      await handleUpdateProposalSubmit.mutateAsync({
        ...proposal,
        client: proposal.client?._id,
        project: proposal.project?._id,
        amount: getProposalTotalAmount(estimateBlock),
      } as CreateProposal);
    } catch (error) {
      console.log(error);
    }
  };

  if (proposal?.status === ProposalStatus.APPROVED) {
    push(`/proposals/${query.id}/details`);
  }

  return (
    <Box id="proposal-edit-page">
      <ProposalEditPageContainer
        header={
          !isLoading && (
            <ProposalEditHeader
              openPreview={openPreview}
              toggleOpenPreview={toggleOpenPreview}
            />
          )
        }
        aside={
          <>
            {!isLoading && (
              <Aside p="md" hiddenBreakpoint="sm" width={{ sm: drawerWidth }}>
                <ProposalEditSideDrawer
                  updateProposalSubmit={updateProposal}
                  updateLoading={handleUpdateProposalSubmit.isLoading}
                />
              </Aside>
            )}
          </>
        }
      >
        {isLoading && <LoadingLoader height="90vh" />}
        {!isLoading && (
          <Box className="flex">
            <Box sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
              {openPreview ? (
                <Container size={850}>
                  <ProposalPreview proposal={proposal} />
                </Container>
              ) : (
                <Container size={850}>
                  <ProposalEditForm />
                </Container>
              )}
            </Box>
          </Box>
        )}
      </ProposalEditPageContainer>
    </Box>
  );
}
