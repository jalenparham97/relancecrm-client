import { useState } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  IconTrash,
  IconEdit,
  IconCopy,
  IconArchive,
  IconThumbUp,
  IconBriefcase,
  IconDownload,
  IconArchiveOff,
} from '@tabler/icons';
import {
  ProposalStatus,
  Proposal,
  CreateProposal,
  Project,
} from '@/core/types';
import {
  useProposalAddMutation,
  useProposalDeleteMutation,
  useProposalUpdateStatusMutation,
} from '@/app/api/proposals';
import { useDialog } from '@/app/hooks';
import { formatCurrency, omitObjProperty } from '@/core/utils';
import currency from 'currency.js';
import DeleteModal from '@/app/components/shared/DeleteModal';
import ProjectPickerModal from '../projects/ProjectPickerModal';
import { isEmpty } from 'lodash';
import ProposalApproveModal from './ProposalApproveModal';
import ArchiveModal from '../shared/ArchiveModal';
import { getFullName } from '@/app/utils';

interface Props {
  id: string;
  status?: ProposalStatus;
  proposal?: Proposal;
}

export default function ProposalActionMenu({ id, status, proposal }: Props) {
  const router = useRouter();
  const [deleteDialog, openDeleteDialog, closeDeleteDialog] = useDialog();
  const [projectDialog, openProjectDialog, closeProjectDialog] = useDialog();
  const [approveModal, openApproveModal, closeApproveModal] = useDialog();
  const [archiveModal, openArchiveModal, closeArchiveModal] = useDialog();
  const [project, setProject] = useState<Project>({});

  const handleDuplicateProposalSubmit = useProposalAddMutation();
  const handleUpdateProposal = useProposalUpdateStatusMutation(id);
  const handleDeleteProposal = useProposalDeleteMutation();

  const isApproved = proposal?.status === ProposalStatus.APPROVED;
  const isArchived = proposal?.isArchived;

  const onDeleteForm = async () => {
    await handleDeleteProposal.mutateAsync(id);
    closeDeleteDialog();
  };

  const handleDuplicateProposal = async () => {
    try {
      const exludedFields = [
        'userId',
        'id',
        '_id',
        'createdAt',
        'updatedAt',
        'sentDate',
        'approvalDate',
        'approver',
        'isInvoiceCreated',
        'expirationDate',
        'status',
      ];
      const duplicateProposal: CreateProposal = {
        ...omitObjProperty(proposal, exludedFields),
        title: `Copy ${proposal?.title}`,
        client: proposal?.client?._id,
        project: proposal?.project?._id,
        content: proposal?.content,
        toName: getFullName(proposal?.client) || '',
        toEmail: proposal?.client?.email || '',
        toAddress: proposal?.client?.address || '',
        toCompany: proposal?.client?.company || '',
        fromName: proposal?.fromName || '',
        fromCompany: proposal?.fromCompany || '',
        fromAddress: proposal?.fromAddress || '',
        amount: currency(proposal?.amount).value,
      };
      const newProposal = await handleDuplicateProposalSubmit.mutateAsync(
        duplicateProposal
      );
      router.push(`/proposals/${newProposal._id}/edit`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveStatus = async () => {
    try {
      await handleUpdateProposal.mutateAsync({
        status: ProposalStatus.APPROVED,
        approvalDate: new Date().toISOString(),
        approver: 'manual',
      });
      closeApproveModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleArchiveStatus = async () => {
    try {
      await handleUpdateProposal.mutateAsync({
        isArchived: !proposal?.isArchived,
      });
      closeArchiveModal();
    } catch (error) {
      console.log(error);
    }
  };

  const saveProjectToProposal = async () => {
    try {
      await handleUpdateProposal.mutateAsync({ project: project._id });
      closeProjectDialog();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menu closeOnItemClick={false}>
        <>
          {!isArchived && (
            <>
              {!isApproved && (
                <Menu.Item
                  component={NextLink}
                  href={`/proposals/${id}/edit`}
                  icon={<IconEdit size={16} />}
                >
                  Edit
                </Menu.Item>
              )}
              <Menu.Item
                icon={<IconCopy size={16} />}
                onClick={handleDuplicateProposal}
                disabled={handleDuplicateProposalSubmit.isLoading}
              >
                Duplicate
              </Menu.Item>
              <Menu.Item icon={<IconDownload size={16} />}>
                Download PDF
              </Menu.Item>
              {!isApproved && (
                <Menu.Item
                  icon={<IconThumbUp size={16} />}
                  onClick={openApproveModal}
                >
                  Mark as approved
                </Menu.Item>
              )}
              {isEmpty(proposal?.project) && (
                <Menu.Item
                  icon={<IconBriefcase size={16} />}
                  onClick={openProjectDialog}
                >
                  Add to a project
                </Menu.Item>
              )}

              <Menu.Item
                icon={<IconArchive size={16} />}
                onClick={openArchiveModal}
              >
                Archive
              </Menu.Item>
            </>
          )}
        </>
        {isArchived && (
          <Menu.Item
            icon={<IconArchiveOff size={16} />}
            onClick={handleArchiveStatus}
            disabled={handleUpdateProposal.isLoading}
          >
            Unarchive
          </Menu.Item>
        )}
        <Menu.Item
          icon={<IconTrash size={16} />}
          color="red"
          onClick={openDeleteDialog}
        >
          Delete
        </Menu.Item>
      </Menu>

      <ProposalApproveModal
        opened={approveModal}
        onClose={closeApproveModal}
        onSubmit={handleApproveStatus}
        isLoading={handleUpdateProposal.isLoading}
      />

      <ArchiveModal
        title="Proposal"
        opened={archiveModal}
        onClose={closeArchiveModal}
        onSubmit={handleArchiveStatus}
        isLoading={handleUpdateProposal.isLoading}
      />

      <ProjectPickerModal
        opened={projectDialog}
        onClose={closeProjectDialog}
        setProject={setProject}
        submit={saveProjectToProposal}
        isLoading={handleUpdateProposal.isLoading}
      />

      <DeleteModal
        title="Proposal"
        opened={deleteDialog}
        onClose={closeDeleteDialog}
        isLoading={handleDeleteProposal.isLoading}
        onDelete={onDeleteForm}
      />
    </>
  );
}
